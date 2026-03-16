// User baseline defaults
export const DEFAULT_BASELINE = {
  age: 21,
  height: 172,
  currentWeight: 74.5,
  targetCalories: 1950,
  maintenanceCalories: 2500,
  proteinTarget: 130,
  stepTarget: 8000,
  gymFrequency: 6,
  waterTarget: 3,
  sleepTarget: 7,
  cycleStartDate: '2026-03-17',
  units: 'metric',
  darkMode: true,
  chartSmoothing: true,
  showAdherenceScore: true,
  showDataQualityScore: true,
  reminderBanners: true,
};

// Scoring thresholds
export const TARGETS = {
  calorieBuffer: 100,      // ± kcal from target
  proteinMin: 130,         // g
  stepMin: 8000,
  waterMin: 3,             // L
  sleepMin: 6,             // hours
  sleepIdeal: 7.5,
};

// Workout types
export const WORKOUT_TYPES = [
  'Push', 'Pull', 'Legs', 'Upper', 'Lower',
  'Full Body', 'Chest & Triceps', 'Back & Biceps',
  'Shoulders', 'Arms', 'Cardio', 'Rest', 'Other',
];

// Digestion options
export const DIGESTION_OPTIONS = [
  'Good', 'Okay', 'Poor', 'Bloated',
];

// Adherence score weights (sum = 100)
export const ADHERENCE_WEIGHTS = {
  caloriesInRange: 25,
  proteinHit: 20,
  stepsHit: 15,
  workoutDone: 15,
  waterGoal: 10,
  sleepAcceptable: 10,
  noBinge: 5,
};

// Data quality weights (sum = 100)
export const QUALITY_WEIGHTS = {
  fullyTracked: 30,
  foodWeighed: 25,
  hiddenCaloriesCounted: 25,
  sameWeighInConditions: 10,
  allFieldsComplete: 10,
};
