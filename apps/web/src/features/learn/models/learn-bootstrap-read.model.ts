import {
  EMPTY_LEARNING_CATALOG_MAP,
  EMPTY_LEARNING_CATALOG_SELECTION,
  type LearningCatalogMapModel,
  type LearningCatalogSelectionModel,
} from './learning-catalog.model';
import type { LearningProgressionModel } from './learning-progression.model';

export interface LearnBootstrapReadModel {
  readonly catalog: LearningCatalogSelectionModel;
  readonly catalogMap: LearningCatalogMapModel;
  readonly progression: LearningProgressionModel | null;
}

export const EMPTY_LEARN_BOOTSTRAP_READ_MODEL: LearnBootstrapReadModel = {
  catalog: EMPTY_LEARNING_CATALOG_SELECTION,
  catalogMap: EMPTY_LEARNING_CATALOG_MAP,
  progression: null,
};