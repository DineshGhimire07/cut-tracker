/**
 * Calculate rolling average for an array of numbers
 */
export function rollingAverage(data, window = 7) {
  return data.map((_, i) => {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1).filter(v => v != null);
    if (slice.length === 0) return null;
    return +(slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2);
  });
}

/**
 * Calculate consistency score across an array of logs
 */
export function calcConsistencyScore(logs, baseline) {
  if (!logs || logs.length === 0) return 0;
  const target = baseline?.targetCalories || 1950;
  const buffer = 100;

  let consistentDays = 0;
  logs.forEach(log => {
    let factors = 0;
    let hits = 0;

    if (log.calories != null) {
      factors++;
      if (Math.abs(log.calories - target) <= buffer) hits++;
    }
    if (log.protein != null) {
      factors++;
      if (log.protein >= (baseline?.proteinTarget || 130)) hits++;
    }
    if (log.steps != null) {
      factors++;
      if (log.steps >= (baseline?.stepTarget || 8000)) hits++;
    }
    if (factors > 0 && hits / factors >= 0.67) consistentDays++;
  });

  return Math.round((consistentDays / logs.length) * 100);
}

/**
 * Calculate average of a numeric field across logs
 */
export function avgField(logs, field) {
  const vals = logs.map(l => l[field]).filter(v => v != null && !isNaN(v));
  if (vals.length === 0) return null;
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

/**
 * Get weight trend direction
 */
export function getWeightTrend(logs) {
  const weights = logs.map(l => l.weight).filter(v => v != null);
  if (weights.length < 3) return { direction: 'insufficient', change: 0 };

  const firstHalf = weights.slice(0, Math.ceil(weights.length / 2));
  const secondHalf = weights.slice(Math.floor(weights.length / 2));

  const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  const change = +(avgSecond - avgFirst).toFixed(2);

  if (change < -0.3) return { direction: 'down', change };
  if (change > 0.3) return { direction: 'up', change };
  return { direction: 'stable', change };
}

/**
 * Generate insight messages from log data
 */
export function generateInsights(logs, baseline) {
  const insights = [];
  if (!logs || logs.length === 0) return insights;

  const trend = getWeightTrend(logs);
  const weights = logs.map(l => l.weight).filter(v => v != null);
  const avgWeight7 = weights.length >= 7
    ? +(weights.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, weights.slice(-7).length)).toFixed(1)
    : null;

  // Weight trend insights
  if (trend.direction === 'down') {
    insights.push({
      text: 'Your weight is noisy, but the 7-day average is trending down.',
      type: 'success',
    });
  } else if (trend.direction === 'up') {
    insights.push({
      text: 'Weight trend is going up. Review calorie accuracy and hidden sources.',
      type: 'warning',
    });
  } else if (trend.direction === 'stable') {
    insights.push({
      text: 'Weight is stable. May need a slight calorie adjustment if fat loss is the goal.',
      type: 'info',
    });
  }

  // Protein days
  const lowProteinDays = logs.filter(l => l.protein != null && l.protein < (baseline?.proteinTarget || 130)).length;
  if (lowProteinDays >= 3) {
    insights.push({
      text: `${lowProteinDays} low-protein days may be reducing recovery quality.`,
      type: 'warning',
    });
  }

  // Steps
  const lowStepDays = logs.filter(l => l.steps != null && l.steps < (baseline?.stepTarget || 8000)).length;
  if (lowStepDays > logs.length / 2) {
    insights.push({
      text: 'Step consistency is the weakest part of this phase.',
      type: 'warning',
    });
  }

  // Tracking quality
  const untrackedDays = logs.filter(l => !l.fullyTracked).length;
  if (untrackedDays >= 2) {
    insights.push({
      text: `${untrackedDays} days were not fully tracked, so judgment confidence is lower.`,
      type: 'danger',
    });
  }

  // Emotional reminder
  if (weights.length >= 5) {
    const dailySwings = [];
    for (let i = 1; i < weights.length; i++) {
      dailySwings.push(Math.abs(weights[i] - weights[i - 1]));
    }
    const avgSwing = dailySwings.reduce((a, b) => a + b, 0) / dailySwings.length;
    if (avgSwing > 0.4) {
      insights.push({
        text: 'You are reacting to daily noise. Focus on average trend.',
        type: 'info',
      });
    }
  }

  return insights;
}

/**
 * Generate 14-day cut analysis
 */
export function generateCutAnalysis(logs, baseline) {
  if (!logs || logs.length < 7) {
    return {
      status: 'insufficient',
      message: 'Not enough data to generate a cut analysis. Keep tracking consistently.',
      recommendations: ['Continue logging every day.', 'Focus on data quality.'],
    };
  }

  const avgQuality = avgField(logs, 'dataQualityScore') || 0;
  const avgAdherence = avgField(logs, 'adherenceScore') || 0;
  const trend = getWeightTrend(logs);
  const avgHunger = avgField(logs, 'hungerLevel') || 5;
  const avgEnergy = avgField(logs, 'energyLevel') || 5;
  const avgSleep = avgField(logs, 'sleepHours') || 7;

  // Low quality tracking
  if (avgQuality < 50) {
    return {
      status: 'low_quality',
      message: 'Tracking quality is too weak to make confident decisions.',
      recommendations: [
        'Do not make aggressive changes yet.',
        'Improve tracking consistency first.',
        'Weigh food accurately and count hidden calories.',
        'Ensure weigh-in conditions are consistent.',
      ],
    };
  }

  // High quality + weight dropping
  if (avgQuality >= 70 && avgAdherence >= 70 && trend.direction === 'down') {
    return {
      status: 'on_track',
      message: 'Cut is on track. Continue current plan.',
      recommendations: [
        'Good compliance. Maintain current calorie target.',
        'Keep protein high for muscle retention.',
        `Current trend: ${trend.change} kg shift.`,
      ],
    };
  }

  // High quality + adherent + no drop
  if (avgQuality >= 70 && avgAdherence >= 70 && trend.direction !== 'down') {
    return {
      status: 'plateau',
      message: 'Adherence is strong but weight is not dropping.',
      recommendations: [
        'Consider reducing calories by 100 kcal.',
        'Or increase daily steps by 1,000.',
        'Do not make drastic changes.',
        'Reassess after another 7 days of clean data.',
      ],
    };
  }

  // Deficit too aggressive
  if (avgHunger >= 8 && avgEnergy <= 3 && avgSleep < 6) {
    return {
      status: 'too_aggressive',
      message: 'Deficit may be too aggressive. Recovery is at risk.',
      recommendations: [
        'Consider a small calorie increase (+100–200 kcal).',
        'Prioritize sleep quality.',
        'A diet break or refeed day may help.',
        'Monitor gym performance closely.',
      ],
    };
  }

  return {
    status: 'continue',
    message: 'More clean data needed before making changes.',
    recommendations: [
      'Continue current plan.',
      'Focus on tracking quality.',
      'Judgment should come from weekly average, not one weigh-in.',
    ],
  };
}
