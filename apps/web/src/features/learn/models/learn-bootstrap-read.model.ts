import {
  EMPTY_LEARNING_CATALOG_SELECTION,
  type LearningCatalogSelectionModel,
} from './learning-catalog.model';
import type { LearningProgressionModel } from './learning-progression.model';

export interface LearnBootstrapReadModel {
  readonly catalog: LearningCatalogSelectionModel;
  readonly progression: LearningProgressionModel | null;
}

export const EMPTY_LEARN_BOOTSTRAP_READ_MODEL: LearnBootstrapReadModel = {
  catalog: EMPTY_LEARNING_CATALOG_SELECTION,
  progression: null,
};