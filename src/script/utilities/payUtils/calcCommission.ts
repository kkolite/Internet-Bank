import { FRACTION_LENGTH, PERCENTS_AMOUNT } from '../../data/constants';

export function calculateCommissionSum(operationSum: number, commisPercent: number): number {
  return +((operationSum * commisPercent) / PERCENTS_AMOUNT).toFixed(FRACTION_LENGTH);
}
