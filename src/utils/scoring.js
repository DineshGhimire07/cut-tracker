import { TARGETS, ADHERENCE_WEIGHTS, QUALITY_WEIGHTS } from '../data/constants';

/**
 * Calculate adherence score for a daily log entry (0–100)
 */
export function calcAdherence(entry, baseline) {
  let score = 0;
  const t = baseline || {};
  const targetCal = t.targetCalories || 1950;
  const proteinMin = t.proteinTarget || TARGETS.proteinMin;
  const stepMin = t.stepTarget || TARGETS.stepMin;

  // Calories within target range
  if (entry.calories && Math.abs(entry.calories - targetCal) <= TARGETS.calorieBuffer) {
    score += ADHERENCE_WEIGHTS.caloriesInRange;
  } else if (entry.calories && Math.abs(entry.calories - targetCal) <= TARGETS.calorieBuffer * 2) {
    score += ADHERENCE_WEIGHTS.caloriesInRange * 0.5;
  }

  // Protein target hit
  if (entry.protein >= proteinMin) {
    score += ADHERENCE_WEIGHTS.proteinHit;
  } else if (entry.protein >= proteinMin * 0.85) {
    score += ADHERENCE_WEIGHTS.proteinHit * 0.5;
  }

  // Steps target hit
  if (entry.steps >= stepMin) {
    score += ADHERENCE_WEIGHTS.stepsHit;
  } else if (entry.steps >= stepMin * 0.75) {
    score += ADHERENCE_WEIGHTS.stepsHit * 0.5;
  }

  // Workout completed
  if (entry.workoutDone) {
    score += ADHERENCE_WEIGHTS.workoutDone;
  }

  // Water goal
  if (entry.waterIntake >= TARGETS.waterMin) {
    score += ADHERENCE_WEIGHTS.waterGoal;
  } else if (entry.waterIntake >= TARGETS.waterMin * 0.7) {
    score += ADHERENCE_WEIGHTS.waterGoal * 0.5;
  }

  // Sleep acceptable
  if (entry.sleepHours >= TARGETS.sleepMin) {
    score += ADHERENCE_WEIGHTS.sleepAcceptable;
  }

  // No binge/untracked food
  if (!entry.bingeOrUntrackedFood) {
    score += ADHERENCE_WEIGHTS.noBinge;
  }

  return Math.round(score);
}

/**
 * Calculate data quality score for a daily log entry (0–100)
 */
export function calcDataQuality(entry) {
  let score = 0;

  if (entry.fullyTracked) score += QUALITY_WEIGHTS.fullyTracked;
  if (entry.foodWeighed) score += QUALITY_WEIGHTS.foodWeighed;
  if (entry.hiddenCaloriesCounted) score += QUALITY_WEIGHTS.hiddenCaloriesCounted;
  if (entry.sameWeighInConditions) score += QUALITY_WEIGHTS.sameWeighInConditions;

  // All major fields complete
  const majorFields = ['weight', 'calories', 'protein', 'steps', 'sleepHours', 'waterIntake'];
  const allComplete = majorFields.every(f => entry[f] != null && entry[f] !== '');
  if (allComplete) score += QUALITY_WEIGHTS.allFieldsComplete;

  return Math.round(score);
}

/**
 * Get adherence badge type
 */
export function getAdherenceBadge(score) {
  if (score >= 80) return { label: 'Strong', type: 'success' };
  if (score >= 60) return { label: 'Moderate', type: 'warning' };
  return { label: 'Weak', type: 'danger' };
}

/**
 * Get data quality badge type
 */
export function getQualityBadge(score) {
  if (score >= 80) return { label: 'Reliable', type: 'success' };
  if (score >= 50) return { label: 'Partial', type: 'warning' };
  return { label: 'Unreliable', type: 'danger' };
}
