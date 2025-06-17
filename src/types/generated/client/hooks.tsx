import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  date: { input: any; output: any; }
  numeric: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** columns and relationships of "bread_entries" */
export type BreadEntries = {
  __typename?: 'BreadEntries';
  analysis: Scalars['String']['output'];
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  cons: Scalars['String']['output'];
  consConfidence: Scalars['numeric']['output'];
  createdAt: Scalars['timestamptz']['output'];
  crumbStructure: Scalars['String']['output'];
  crumbStructureConfidence: Scalars['numeric']['output'];
  crumbStructureDescription: Scalars['String']['output'];
  crustCrumbConfidence: Scalars['numeric']['output'];
  crustCrumbDescription: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  expertGuidance: Scalars['String']['output'];
  expertGuidanceConfidence: Scalars['numeric']['output'];
  hasLargeHolesNearTop: Scalars['Boolean']['output'];
  hasSeparation: Scalars['Boolean']['output'];
  hasValidImage: Scalars['Boolean']['output'];
  holeDistributionConfidence: Scalars['numeric']['output'];
  holeDistributionDescription: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An array relationship */
  images: Array<BreadEntryImages>;
  /** An aggregate relationship */
  imagesAggregate: BreadEntryImagesAggregate;
  isGummyOrDense: Scalars['Boolean']['output'];
  isHoleDistributionEven: Scalars['Boolean']['output'];
  isLightAndAiry: Scalars['Boolean']['output'];
  isWellBonded: Scalars['Boolean']['output'];
  llmCompletionTokens?: Maybe<Scalars['Int']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  llmModel?: Maybe<Scalars['String']['output']>;
  llmPresencePenalty?: Maybe<Scalars['numeric']['output']>;
  llmPromptTokens?: Maybe<Scalars['Int']['output']>;
  llmTemperature?: Maybe<Scalars['numeric']['output']>;
  llmTopP?: Maybe<Scalars['numeric']['output']>;
  llmTotalTokens?: Maybe<Scalars['Int']['output']>;
  message: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  overallConfidence: Scalars['numeric']['output'];
  overallScore: Scalars['numeric']['output'];
  pros: Scalars['String']['output'];
  prosConfidence: Scalars['numeric']['output'];
  /** An object relationship */
  recipe?: Maybe<Recipes>;
  recipeId?: Maybe<Scalars['uuid']['output']>;
  summary: Scalars['String']['output'];
  textureConfidence: Scalars['numeric']['output'];
  textureDescription: Scalars['String']['output'];
  trendAnalysis?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
  validImageConfidence: Scalars['numeric']['output'];
};


/** columns and relationships of "bread_entries" */
export type BreadEntriesImagesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


/** columns and relationships of "bread_entries" */
export type BreadEntriesImagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};

/** aggregated selection of "bread_entries" */
export type BreadEntriesAggregate = {
  __typename?: 'BreadEntriesAggregate';
  aggregate?: Maybe<BreadEntriesAggregateFields>;
  nodes: Array<BreadEntries>;
};

export type BreadEntriesAggregateBoolExp = {
  bool_and?: InputMaybe<BreadEntriesAggregateBoolExpBool_And>;
  bool_or?: InputMaybe<BreadEntriesAggregateBoolExpBool_Or>;
  count?: InputMaybe<BreadEntriesAggregateBoolExpCount>;
};

/** aggregate fields of "bread_entries" */
export type BreadEntriesAggregateFields = {
  __typename?: 'BreadEntriesAggregateFields';
  avg?: Maybe<BreadEntriesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BreadEntriesMaxFields>;
  min?: Maybe<BreadEntriesMinFields>;
  stddev?: Maybe<BreadEntriesStddevFields>;
  stddevPop?: Maybe<BreadEntriesStddevPopFields>;
  stddevSamp?: Maybe<BreadEntriesStddevSampFields>;
  sum?: Maybe<BreadEntriesSumFields>;
  varPop?: Maybe<BreadEntriesVarPopFields>;
  varSamp?: Maybe<BreadEntriesVarSampFields>;
  variance?: Maybe<BreadEntriesVarianceFields>;
};


/** aggregate fields of "bread_entries" */
export type BreadEntriesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "bread_entries" */
export type BreadEntriesAggregateOrderBy = {
  avg?: InputMaybe<BreadEntriesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BreadEntriesMaxOrderBy>;
  min?: InputMaybe<BreadEntriesMinOrderBy>;
  stddev?: InputMaybe<BreadEntriesStddevOrderBy>;
  stddevPop?: InputMaybe<BreadEntriesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BreadEntriesStddevSampOrderBy>;
  sum?: InputMaybe<BreadEntriesSumOrderBy>;
  varPop?: InputMaybe<BreadEntriesVarPopOrderBy>;
  varSamp?: InputMaybe<BreadEntriesVarSampOrderBy>;
  variance?: InputMaybe<BreadEntriesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "bread_entries" */
export type BreadEntriesArrRelInsertInput = {
  data: Array<BreadEntriesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BreadEntriesOnConflict>;
};

/** aggregate avg on columns */
export type BreadEntriesAvgFields = {
  __typename?: 'BreadEntriesAvgFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "bread_entries" */
export type BreadEntriesAvgOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "bread_entries". All fields are combined with a logical 'AND'. */
export type BreadEntriesBoolExp = {
  _and?: InputMaybe<Array<BreadEntriesBoolExp>>;
  _not?: InputMaybe<BreadEntriesBoolExp>;
  _or?: InputMaybe<Array<BreadEntriesBoolExp>>;
  analysis?: InputMaybe<StringComparisonExp>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  cons?: InputMaybe<StringComparisonExp>;
  consConfidence?: InputMaybe<NumericComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  crumbStructure?: InputMaybe<StringComparisonExp>;
  crumbStructureConfidence?: InputMaybe<NumericComparisonExp>;
  crumbStructureDescription?: InputMaybe<StringComparisonExp>;
  crustCrumbConfidence?: InputMaybe<NumericComparisonExp>;
  crustCrumbDescription?: InputMaybe<StringComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  expertGuidance?: InputMaybe<StringComparisonExp>;
  expertGuidanceConfidence?: InputMaybe<NumericComparisonExp>;
  hasLargeHolesNearTop?: InputMaybe<BooleanComparisonExp>;
  hasSeparation?: InputMaybe<BooleanComparisonExp>;
  hasValidImage?: InputMaybe<BooleanComparisonExp>;
  holeDistributionConfidence?: InputMaybe<NumericComparisonExp>;
  holeDistributionDescription?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  images?: InputMaybe<BreadEntryImagesBoolExp>;
  imagesAggregate?: InputMaybe<BreadEntryImagesAggregateBoolExp>;
  isGummyOrDense?: InputMaybe<BooleanComparisonExp>;
  isHoleDistributionEven?: InputMaybe<BooleanComparisonExp>;
  isLightAndAiry?: InputMaybe<BooleanComparisonExp>;
  isWellBonded?: InputMaybe<BooleanComparisonExp>;
  llmCompletionTokens?: InputMaybe<IntComparisonExp>;
  llmFrequencyPenalty?: InputMaybe<NumericComparisonExp>;
  llmModel?: InputMaybe<StringComparisonExp>;
  llmPresencePenalty?: InputMaybe<NumericComparisonExp>;
  llmPromptTokens?: InputMaybe<IntComparisonExp>;
  llmTemperature?: InputMaybe<NumericComparisonExp>;
  llmTopP?: InputMaybe<NumericComparisonExp>;
  llmTotalTokens?: InputMaybe<IntComparisonExp>;
  message?: InputMaybe<StringComparisonExp>;
  notes?: InputMaybe<StringComparisonExp>;
  overallConfidence?: InputMaybe<NumericComparisonExp>;
  overallScore?: InputMaybe<NumericComparisonExp>;
  pros?: InputMaybe<StringComparisonExp>;
  prosConfidence?: InputMaybe<NumericComparisonExp>;
  recipe?: InputMaybe<RecipesBoolExp>;
  recipeId?: InputMaybe<UuidComparisonExp>;
  summary?: InputMaybe<StringComparisonExp>;
  textureConfidence?: InputMaybe<NumericComparisonExp>;
  textureDescription?: InputMaybe<StringComparisonExp>;
  trendAnalysis?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  validImageConfidence?: InputMaybe<NumericComparisonExp>;
};

/** unique or primary key constraints on table "bread_entries" */
export enum BreadEntriesConstraint {
  /** unique or primary key constraint on columns "id" */
  BreadEntriesPkey = 'bread_entries_pkey'
}

/** input type for incrementing numeric columns in table "bread_entries" */
export type BreadEntriesIncInput = {
  consConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crumbStructureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crustCrumbConfidence?: InputMaybe<Scalars['numeric']['input']>;
  expertGuidanceConfidence?: InputMaybe<Scalars['numeric']['input']>;
  holeDistributionConfidence?: InputMaybe<Scalars['numeric']['input']>;
  llmCompletionTokens?: InputMaybe<Scalars['Int']['input']>;
  llmFrequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmPresencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmPromptTokens?: InputMaybe<Scalars['Int']['input']>;
  llmTemperature?: InputMaybe<Scalars['numeric']['input']>;
  llmTopP?: InputMaybe<Scalars['numeric']['input']>;
  llmTotalTokens?: InputMaybe<Scalars['Int']['input']>;
  overallConfidence?: InputMaybe<Scalars['numeric']['input']>;
  overallScore?: InputMaybe<Scalars['numeric']['input']>;
  prosConfidence?: InputMaybe<Scalars['numeric']['input']>;
  textureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  validImageConfidence?: InputMaybe<Scalars['numeric']['input']>;
};

/** input type for inserting data into table "bread_entries" */
export type BreadEntriesInsertInput = {
  analysis?: InputMaybe<Scalars['String']['input']>;
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  cons?: InputMaybe<Scalars['String']['input']>;
  consConfidence?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  crumbStructure?: InputMaybe<Scalars['String']['input']>;
  crumbStructureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crumbStructureDescription?: InputMaybe<Scalars['String']['input']>;
  crustCrumbConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crustCrumbDescription?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expertGuidance?: InputMaybe<Scalars['String']['input']>;
  expertGuidanceConfidence?: InputMaybe<Scalars['numeric']['input']>;
  hasLargeHolesNearTop?: InputMaybe<Scalars['Boolean']['input']>;
  hasSeparation?: InputMaybe<Scalars['Boolean']['input']>;
  hasValidImage?: InputMaybe<Scalars['Boolean']['input']>;
  holeDistributionConfidence?: InputMaybe<Scalars['numeric']['input']>;
  holeDistributionDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  images?: InputMaybe<BreadEntryImagesArrRelInsertInput>;
  isGummyOrDense?: InputMaybe<Scalars['Boolean']['input']>;
  isHoleDistributionEven?: InputMaybe<Scalars['Boolean']['input']>;
  isLightAndAiry?: InputMaybe<Scalars['Boolean']['input']>;
  isWellBonded?: InputMaybe<Scalars['Boolean']['input']>;
  llmCompletionTokens?: InputMaybe<Scalars['Int']['input']>;
  llmFrequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmModel?: InputMaybe<Scalars['String']['input']>;
  llmPresencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmPromptTokens?: InputMaybe<Scalars['Int']['input']>;
  llmTemperature?: InputMaybe<Scalars['numeric']['input']>;
  llmTopP?: InputMaybe<Scalars['numeric']['input']>;
  llmTotalTokens?: InputMaybe<Scalars['Int']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overallConfidence?: InputMaybe<Scalars['numeric']['input']>;
  overallScore?: InputMaybe<Scalars['numeric']['input']>;
  pros?: InputMaybe<Scalars['String']['input']>;
  prosConfidence?: InputMaybe<Scalars['numeric']['input']>;
  recipe?: InputMaybe<RecipesObjRelInsertInput>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  textureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  textureDescription?: InputMaybe<Scalars['String']['input']>;
  trendAnalysis?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  validImageConfidence?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate max on columns */
export type BreadEntriesMaxFields = {
  __typename?: 'BreadEntriesMaxFields';
  analysis?: Maybe<Scalars['String']['output']>;
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  cons?: Maybe<Scalars['String']['output']>;
  consConfidence?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  crumbStructure?: Maybe<Scalars['String']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['numeric']['output']>;
  crumbStructureDescription?: Maybe<Scalars['String']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['numeric']['output']>;
  crustCrumbDescription?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  expertGuidance?: Maybe<Scalars['String']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['numeric']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['numeric']['output']>;
  holeDistributionDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Int']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  llmModel?: Maybe<Scalars['String']['output']>;
  llmPresencePenalty?: Maybe<Scalars['numeric']['output']>;
  llmPromptTokens?: Maybe<Scalars['Int']['output']>;
  llmTemperature?: Maybe<Scalars['numeric']['output']>;
  llmTopP?: Maybe<Scalars['numeric']['output']>;
  llmTotalTokens?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  overallConfidence?: Maybe<Scalars['numeric']['output']>;
  overallScore?: Maybe<Scalars['numeric']['output']>;
  pros?: Maybe<Scalars['String']['output']>;
  prosConfidence?: Maybe<Scalars['numeric']['output']>;
  recipeId?: Maybe<Scalars['uuid']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  textureConfidence?: Maybe<Scalars['numeric']['output']>;
  textureDescription?: Maybe<Scalars['String']['output']>;
  trendAnalysis?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  validImageConfidence?: Maybe<Scalars['numeric']['output']>;
};

/** order by max() on columns of table "bread_entries" */
export type BreadEntriesMaxOrderBy = {
  analysis?: InputMaybe<OrderBy>;
  archivedAt?: InputMaybe<OrderBy>;
  cons?: InputMaybe<OrderBy>;
  consConfidence?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  crumbStructure?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crumbStructureDescription?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  crustCrumbDescription?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  expertGuidance?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  holeDistributionDescription?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmModel?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  pros?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  summary?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  textureDescription?: InputMaybe<OrderBy>;
  trendAnalysis?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BreadEntriesMinFields = {
  __typename?: 'BreadEntriesMinFields';
  analysis?: Maybe<Scalars['String']['output']>;
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  cons?: Maybe<Scalars['String']['output']>;
  consConfidence?: Maybe<Scalars['numeric']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  crumbStructure?: Maybe<Scalars['String']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['numeric']['output']>;
  crumbStructureDescription?: Maybe<Scalars['String']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['numeric']['output']>;
  crustCrumbDescription?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  expertGuidance?: Maybe<Scalars['String']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['numeric']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['numeric']['output']>;
  holeDistributionDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Int']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  llmModel?: Maybe<Scalars['String']['output']>;
  llmPresencePenalty?: Maybe<Scalars['numeric']['output']>;
  llmPromptTokens?: Maybe<Scalars['Int']['output']>;
  llmTemperature?: Maybe<Scalars['numeric']['output']>;
  llmTopP?: Maybe<Scalars['numeric']['output']>;
  llmTotalTokens?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  overallConfidence?: Maybe<Scalars['numeric']['output']>;
  overallScore?: Maybe<Scalars['numeric']['output']>;
  pros?: Maybe<Scalars['String']['output']>;
  prosConfidence?: Maybe<Scalars['numeric']['output']>;
  recipeId?: Maybe<Scalars['uuid']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  textureConfidence?: Maybe<Scalars['numeric']['output']>;
  textureDescription?: Maybe<Scalars['String']['output']>;
  trendAnalysis?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  validImageConfidence?: Maybe<Scalars['numeric']['output']>;
};

/** order by min() on columns of table "bread_entries" */
export type BreadEntriesMinOrderBy = {
  analysis?: InputMaybe<OrderBy>;
  archivedAt?: InputMaybe<OrderBy>;
  cons?: InputMaybe<OrderBy>;
  consConfidence?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  crumbStructure?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crumbStructureDescription?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  crustCrumbDescription?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  expertGuidance?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  holeDistributionDescription?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmModel?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  pros?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  summary?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  textureDescription?: InputMaybe<OrderBy>;
  trendAnalysis?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "bread_entries" */
export type BreadEntriesMutationResponse = {
  __typename?: 'BreadEntriesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BreadEntries>;
};

/** input type for inserting object relation for remote table "bread_entries" */
export type BreadEntriesObjRelInsertInput = {
  data: BreadEntriesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<BreadEntriesOnConflict>;
};

/** on_conflict condition type for table "bread_entries" */
export type BreadEntriesOnConflict = {
  constraint: BreadEntriesConstraint;
  updateColumns?: Array<BreadEntriesUpdateColumn>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};

/** Ordering options when selecting data from "bread_entries". */
export type BreadEntriesOrderBy = {
  analysis?: InputMaybe<OrderBy>;
  archivedAt?: InputMaybe<OrderBy>;
  cons?: InputMaybe<OrderBy>;
  consConfidence?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  crumbStructure?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crumbStructureDescription?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  crustCrumbDescription?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  expertGuidance?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  hasLargeHolesNearTop?: InputMaybe<OrderBy>;
  hasSeparation?: InputMaybe<OrderBy>;
  hasValidImage?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  holeDistributionDescription?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  imagesAggregate?: InputMaybe<BreadEntryImagesAggregateOrderBy>;
  isGummyOrDense?: InputMaybe<OrderBy>;
  isHoleDistributionEven?: InputMaybe<OrderBy>;
  isLightAndAiry?: InputMaybe<OrderBy>;
  isWellBonded?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmModel?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  message?: InputMaybe<OrderBy>;
  notes?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  pros?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  recipe?: InputMaybe<RecipesOrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  summary?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  textureDescription?: InputMaybe<OrderBy>;
  trendAnalysis?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: bread_entries */
export type BreadEntriesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "bread_entries" */
export enum BreadEntriesSelectColumn {
  /** column name */
  Analysis = 'analysis',
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Cons = 'cons',
  /** column name */
  ConsConfidence = 'consConfidence',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CrumbStructure = 'crumbStructure',
  /** column name */
  CrumbStructureConfidence = 'crumbStructureConfidence',
  /** column name */
  CrumbStructureDescription = 'crumbStructureDescription',
  /** column name */
  CrustCrumbConfidence = 'crustCrumbConfidence',
  /** column name */
  CrustCrumbDescription = 'crustCrumbDescription',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  ExpertGuidance = 'expertGuidance',
  /** column name */
  ExpertGuidanceConfidence = 'expertGuidanceConfidence',
  /** column name */
  HasLargeHolesNearTop = 'hasLargeHolesNearTop',
  /** column name */
  HasSeparation = 'hasSeparation',
  /** column name */
  HasValidImage = 'hasValidImage',
  /** column name */
  HoleDistributionConfidence = 'holeDistributionConfidence',
  /** column name */
  HoleDistributionDescription = 'holeDistributionDescription',
  /** column name */
  Id = 'id',
  /** column name */
  IsGummyOrDense = 'isGummyOrDense',
  /** column name */
  IsHoleDistributionEven = 'isHoleDistributionEven',
  /** column name */
  IsLightAndAiry = 'isLightAndAiry',
  /** column name */
  IsWellBonded = 'isWellBonded',
  /** column name */
  LlmCompletionTokens = 'llmCompletionTokens',
  /** column name */
  LlmFrequencyPenalty = 'llmFrequencyPenalty',
  /** column name */
  LlmModel = 'llmModel',
  /** column name */
  LlmPresencePenalty = 'llmPresencePenalty',
  /** column name */
  LlmPromptTokens = 'llmPromptTokens',
  /** column name */
  LlmTemperature = 'llmTemperature',
  /** column name */
  LlmTopP = 'llmTopP',
  /** column name */
  LlmTotalTokens = 'llmTotalTokens',
  /** column name */
  Message = 'message',
  /** column name */
  Notes = 'notes',
  /** column name */
  OverallConfidence = 'overallConfidence',
  /** column name */
  OverallScore = 'overallScore',
  /** column name */
  Pros = 'pros',
  /** column name */
  ProsConfidence = 'prosConfidence',
  /** column name */
  RecipeId = 'recipeId',
  /** column name */
  Summary = 'summary',
  /** column name */
  TextureConfidence = 'textureConfidence',
  /** column name */
  TextureDescription = 'textureDescription',
  /** column name */
  TrendAnalysis = 'trendAnalysis',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId',
  /** column name */
  ValidImageConfidence = 'validImageConfidence'
}

/** select "breadEntriesAggregateBoolExpBool_andArgumentsColumns" columns of table "bread_entries" */
export enum BreadEntriesSelectColumnBreadEntriesAggregateBoolExpBool_AndArgumentsColumns {
  /** column name */
  HasLargeHolesNearTop = 'hasLargeHolesNearTop',
  /** column name */
  HasSeparation = 'hasSeparation',
  /** column name */
  HasValidImage = 'hasValidImage',
  /** column name */
  IsGummyOrDense = 'isGummyOrDense',
  /** column name */
  IsHoleDistributionEven = 'isHoleDistributionEven',
  /** column name */
  IsLightAndAiry = 'isLightAndAiry',
  /** column name */
  IsWellBonded = 'isWellBonded'
}

/** select "breadEntriesAggregateBoolExpBool_orArgumentsColumns" columns of table "bread_entries" */
export enum BreadEntriesSelectColumnBreadEntriesAggregateBoolExpBool_OrArgumentsColumns {
  /** column name */
  HasLargeHolesNearTop = 'hasLargeHolesNearTop',
  /** column name */
  HasSeparation = 'hasSeparation',
  /** column name */
  HasValidImage = 'hasValidImage',
  /** column name */
  IsGummyOrDense = 'isGummyOrDense',
  /** column name */
  IsHoleDistributionEven = 'isHoleDistributionEven',
  /** column name */
  IsLightAndAiry = 'isLightAndAiry',
  /** column name */
  IsWellBonded = 'isWellBonded'
}

/** input type for updating data in table "bread_entries" */
export type BreadEntriesSetInput = {
  analysis?: InputMaybe<Scalars['String']['input']>;
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  cons?: InputMaybe<Scalars['String']['input']>;
  consConfidence?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  crumbStructure?: InputMaybe<Scalars['String']['input']>;
  crumbStructureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crumbStructureDescription?: InputMaybe<Scalars['String']['input']>;
  crustCrumbConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crustCrumbDescription?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expertGuidance?: InputMaybe<Scalars['String']['input']>;
  expertGuidanceConfidence?: InputMaybe<Scalars['numeric']['input']>;
  hasLargeHolesNearTop?: InputMaybe<Scalars['Boolean']['input']>;
  hasSeparation?: InputMaybe<Scalars['Boolean']['input']>;
  hasValidImage?: InputMaybe<Scalars['Boolean']['input']>;
  holeDistributionConfidence?: InputMaybe<Scalars['numeric']['input']>;
  holeDistributionDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isGummyOrDense?: InputMaybe<Scalars['Boolean']['input']>;
  isHoleDistributionEven?: InputMaybe<Scalars['Boolean']['input']>;
  isLightAndAiry?: InputMaybe<Scalars['Boolean']['input']>;
  isWellBonded?: InputMaybe<Scalars['Boolean']['input']>;
  llmCompletionTokens?: InputMaybe<Scalars['Int']['input']>;
  llmFrequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmModel?: InputMaybe<Scalars['String']['input']>;
  llmPresencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmPromptTokens?: InputMaybe<Scalars['Int']['input']>;
  llmTemperature?: InputMaybe<Scalars['numeric']['input']>;
  llmTopP?: InputMaybe<Scalars['numeric']['input']>;
  llmTotalTokens?: InputMaybe<Scalars['Int']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overallConfidence?: InputMaybe<Scalars['numeric']['input']>;
  overallScore?: InputMaybe<Scalars['numeric']['input']>;
  pros?: InputMaybe<Scalars['String']['input']>;
  prosConfidence?: InputMaybe<Scalars['numeric']['input']>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  textureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  textureDescription?: InputMaybe<Scalars['String']['input']>;
  trendAnalysis?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  validImageConfidence?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate stddev on columns */
export type BreadEntriesStddevFields = {
  __typename?: 'BreadEntriesStddevFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "bread_entries" */
export type BreadEntriesStddevOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type BreadEntriesStddevPopFields = {
  __typename?: 'BreadEntriesStddevPopFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "bread_entries" */
export type BreadEntriesStddevPopOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type BreadEntriesStddevSampFields = {
  __typename?: 'BreadEntriesStddevSampFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "bread_entries" */
export type BreadEntriesStddevSampOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "bread_entries" */
export type BreadEntriesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BreadEntriesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BreadEntriesStreamCursorValueInput = {
  analysis?: InputMaybe<Scalars['String']['input']>;
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  cons?: InputMaybe<Scalars['String']['input']>;
  consConfidence?: InputMaybe<Scalars['numeric']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  crumbStructure?: InputMaybe<Scalars['String']['input']>;
  crumbStructureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crumbStructureDescription?: InputMaybe<Scalars['String']['input']>;
  crustCrumbConfidence?: InputMaybe<Scalars['numeric']['input']>;
  crustCrumbDescription?: InputMaybe<Scalars['String']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  expertGuidance?: InputMaybe<Scalars['String']['input']>;
  expertGuidanceConfidence?: InputMaybe<Scalars['numeric']['input']>;
  hasLargeHolesNearTop?: InputMaybe<Scalars['Boolean']['input']>;
  hasSeparation?: InputMaybe<Scalars['Boolean']['input']>;
  hasValidImage?: InputMaybe<Scalars['Boolean']['input']>;
  holeDistributionConfidence?: InputMaybe<Scalars['numeric']['input']>;
  holeDistributionDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  isGummyOrDense?: InputMaybe<Scalars['Boolean']['input']>;
  isHoleDistributionEven?: InputMaybe<Scalars['Boolean']['input']>;
  isLightAndAiry?: InputMaybe<Scalars['Boolean']['input']>;
  isWellBonded?: InputMaybe<Scalars['Boolean']['input']>;
  llmCompletionTokens?: InputMaybe<Scalars['Int']['input']>;
  llmFrequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmModel?: InputMaybe<Scalars['String']['input']>;
  llmPresencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  llmPromptTokens?: InputMaybe<Scalars['Int']['input']>;
  llmTemperature?: InputMaybe<Scalars['numeric']['input']>;
  llmTopP?: InputMaybe<Scalars['numeric']['input']>;
  llmTotalTokens?: InputMaybe<Scalars['Int']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  overallConfidence?: InputMaybe<Scalars['numeric']['input']>;
  overallScore?: InputMaybe<Scalars['numeric']['input']>;
  pros?: InputMaybe<Scalars['String']['input']>;
  prosConfidence?: InputMaybe<Scalars['numeric']['input']>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  summary?: InputMaybe<Scalars['String']['input']>;
  textureConfidence?: InputMaybe<Scalars['numeric']['input']>;
  textureDescription?: InputMaybe<Scalars['String']['input']>;
  trendAnalysis?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  validImageConfidence?: InputMaybe<Scalars['numeric']['input']>;
};

/** aggregate sum on columns */
export type BreadEntriesSumFields = {
  __typename?: 'BreadEntriesSumFields';
  consConfidence?: Maybe<Scalars['numeric']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['numeric']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['numeric']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['numeric']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['numeric']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Int']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  llmPresencePenalty?: Maybe<Scalars['numeric']['output']>;
  llmPromptTokens?: Maybe<Scalars['Int']['output']>;
  llmTemperature?: Maybe<Scalars['numeric']['output']>;
  llmTopP?: Maybe<Scalars['numeric']['output']>;
  llmTotalTokens?: Maybe<Scalars['Int']['output']>;
  overallConfidence?: Maybe<Scalars['numeric']['output']>;
  overallScore?: Maybe<Scalars['numeric']['output']>;
  prosConfidence?: Maybe<Scalars['numeric']['output']>;
  textureConfidence?: Maybe<Scalars['numeric']['output']>;
  validImageConfidence?: Maybe<Scalars['numeric']['output']>;
};

/** order by sum() on columns of table "bread_entries" */
export type BreadEntriesSumOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** update columns of table "bread_entries" */
export enum BreadEntriesUpdateColumn {
  /** column name */
  Analysis = 'analysis',
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Cons = 'cons',
  /** column name */
  ConsConfidence = 'consConfidence',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CrumbStructure = 'crumbStructure',
  /** column name */
  CrumbStructureConfidence = 'crumbStructureConfidence',
  /** column name */
  CrumbStructureDescription = 'crumbStructureDescription',
  /** column name */
  CrustCrumbConfidence = 'crustCrumbConfidence',
  /** column name */
  CrustCrumbDescription = 'crustCrumbDescription',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  ExpertGuidance = 'expertGuidance',
  /** column name */
  ExpertGuidanceConfidence = 'expertGuidanceConfidence',
  /** column name */
  HasLargeHolesNearTop = 'hasLargeHolesNearTop',
  /** column name */
  HasSeparation = 'hasSeparation',
  /** column name */
  HasValidImage = 'hasValidImage',
  /** column name */
  HoleDistributionConfidence = 'holeDistributionConfidence',
  /** column name */
  HoleDistributionDescription = 'holeDistributionDescription',
  /** column name */
  Id = 'id',
  /** column name */
  IsGummyOrDense = 'isGummyOrDense',
  /** column name */
  IsHoleDistributionEven = 'isHoleDistributionEven',
  /** column name */
  IsLightAndAiry = 'isLightAndAiry',
  /** column name */
  IsWellBonded = 'isWellBonded',
  /** column name */
  LlmCompletionTokens = 'llmCompletionTokens',
  /** column name */
  LlmFrequencyPenalty = 'llmFrequencyPenalty',
  /** column name */
  LlmModel = 'llmModel',
  /** column name */
  LlmPresencePenalty = 'llmPresencePenalty',
  /** column name */
  LlmPromptTokens = 'llmPromptTokens',
  /** column name */
  LlmTemperature = 'llmTemperature',
  /** column name */
  LlmTopP = 'llmTopP',
  /** column name */
  LlmTotalTokens = 'llmTotalTokens',
  /** column name */
  Message = 'message',
  /** column name */
  Notes = 'notes',
  /** column name */
  OverallConfidence = 'overallConfidence',
  /** column name */
  OverallScore = 'overallScore',
  /** column name */
  Pros = 'pros',
  /** column name */
  ProsConfidence = 'prosConfidence',
  /** column name */
  RecipeId = 'recipeId',
  /** column name */
  Summary = 'summary',
  /** column name */
  TextureConfidence = 'textureConfidence',
  /** column name */
  TextureDescription = 'textureDescription',
  /** column name */
  TrendAnalysis = 'trendAnalysis',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId',
  /** column name */
  ValidImageConfidence = 'validImageConfidence'
}

export type BreadEntriesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BreadEntriesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BreadEntriesSetInput>;
  /** filter the rows which have to be updated */
  where: BreadEntriesBoolExp;
};

/** aggregate varPop on columns */
export type BreadEntriesVarPopFields = {
  __typename?: 'BreadEntriesVarPopFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "bread_entries" */
export type BreadEntriesVarPopOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type BreadEntriesVarSampFields = {
  __typename?: 'BreadEntriesVarSampFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "bread_entries" */
export type BreadEntriesVarSampOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BreadEntriesVarianceFields = {
  __typename?: 'BreadEntriesVarianceFields';
  consConfidence?: Maybe<Scalars['Float']['output']>;
  crumbStructureConfidence?: Maybe<Scalars['Float']['output']>;
  crustCrumbConfidence?: Maybe<Scalars['Float']['output']>;
  expertGuidanceConfidence?: Maybe<Scalars['Float']['output']>;
  holeDistributionConfidence?: Maybe<Scalars['Float']['output']>;
  llmCompletionTokens?: Maybe<Scalars['Float']['output']>;
  llmFrequencyPenalty?: Maybe<Scalars['Float']['output']>;
  llmPresencePenalty?: Maybe<Scalars['Float']['output']>;
  llmPromptTokens?: Maybe<Scalars['Float']['output']>;
  llmTemperature?: Maybe<Scalars['Float']['output']>;
  llmTopP?: Maybe<Scalars['Float']['output']>;
  llmTotalTokens?: Maybe<Scalars['Float']['output']>;
  overallConfidence?: Maybe<Scalars['Float']['output']>;
  overallScore?: Maybe<Scalars['Float']['output']>;
  prosConfidence?: Maybe<Scalars['Float']['output']>;
  textureConfidence?: Maybe<Scalars['Float']['output']>;
  validImageConfidence?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "bread_entries" */
export type BreadEntriesVarianceOrderBy = {
  consConfidence?: InputMaybe<OrderBy>;
  crumbStructureConfidence?: InputMaybe<OrderBy>;
  crustCrumbConfidence?: InputMaybe<OrderBy>;
  expertGuidanceConfidence?: InputMaybe<OrderBy>;
  holeDistributionConfidence?: InputMaybe<OrderBy>;
  llmCompletionTokens?: InputMaybe<OrderBy>;
  llmFrequencyPenalty?: InputMaybe<OrderBy>;
  llmPresencePenalty?: InputMaybe<OrderBy>;
  llmPromptTokens?: InputMaybe<OrderBy>;
  llmTemperature?: InputMaybe<OrderBy>;
  llmTopP?: InputMaybe<OrderBy>;
  llmTotalTokens?: InputMaybe<OrderBy>;
  overallConfidence?: InputMaybe<OrderBy>;
  overallScore?: InputMaybe<OrderBy>;
  prosConfidence?: InputMaybe<OrderBy>;
  textureConfidence?: InputMaybe<OrderBy>;
  validImageConfidence?: InputMaybe<OrderBy>;
};

/** columns and relationships of "bread_entry_images" */
export type BreadEntryImages = {
  __typename?: 'BreadEntryImages';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  breadEntry: BreadEntries;
  breadEntryId: Scalars['uuid']['output'];
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  imageName: Scalars['String']['output'];
  imagePath: Scalars['String']['output'];
  imageStorageProvider: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  originalImageName: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};

/** aggregated selection of "bread_entry_images" */
export type BreadEntryImagesAggregate = {
  __typename?: 'BreadEntryImagesAggregate';
  aggregate?: Maybe<BreadEntryImagesAggregateFields>;
  nodes: Array<BreadEntryImages>;
};

export type BreadEntryImagesAggregateBoolExp = {
  count?: InputMaybe<BreadEntryImagesAggregateBoolExpCount>;
};

/** aggregate fields of "bread_entry_images" */
export type BreadEntryImagesAggregateFields = {
  __typename?: 'BreadEntryImagesAggregateFields';
  avg?: Maybe<BreadEntryImagesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<BreadEntryImagesMaxFields>;
  min?: Maybe<BreadEntryImagesMinFields>;
  stddev?: Maybe<BreadEntryImagesStddevFields>;
  stddevPop?: Maybe<BreadEntryImagesStddevPopFields>;
  stddevSamp?: Maybe<BreadEntryImagesStddevSampFields>;
  sum?: Maybe<BreadEntryImagesSumFields>;
  varPop?: Maybe<BreadEntryImagesVarPopFields>;
  varSamp?: Maybe<BreadEntryImagesVarSampFields>;
  variance?: Maybe<BreadEntryImagesVarianceFields>;
};


/** aggregate fields of "bread_entry_images" */
export type BreadEntryImagesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "bread_entry_images" */
export type BreadEntryImagesAggregateOrderBy = {
  avg?: InputMaybe<BreadEntryImagesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<BreadEntryImagesMaxOrderBy>;
  min?: InputMaybe<BreadEntryImagesMinOrderBy>;
  stddev?: InputMaybe<BreadEntryImagesStddevOrderBy>;
  stddevPop?: InputMaybe<BreadEntryImagesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<BreadEntryImagesStddevSampOrderBy>;
  sum?: InputMaybe<BreadEntryImagesSumOrderBy>;
  varPop?: InputMaybe<BreadEntryImagesVarPopOrderBy>;
  varSamp?: InputMaybe<BreadEntryImagesVarSampOrderBy>;
  variance?: InputMaybe<BreadEntryImagesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "bread_entry_images" */
export type BreadEntryImagesArrRelInsertInput = {
  data: Array<BreadEntryImagesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<BreadEntryImagesOnConflict>;
};

/** aggregate avg on columns */
export type BreadEntryImagesAvgFields = {
  __typename?: 'BreadEntryImagesAvgFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "bread_entry_images" */
export type BreadEntryImagesAvgOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "bread_entry_images". All fields are combined with a logical 'AND'. */
export type BreadEntryImagesBoolExp = {
  _and?: InputMaybe<Array<BreadEntryImagesBoolExp>>;
  _not?: InputMaybe<BreadEntryImagesBoolExp>;
  _or?: InputMaybe<Array<BreadEntryImagesBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  breadEntry?: InputMaybe<BreadEntriesBoolExp>;
  breadEntryId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  imageName?: InputMaybe<StringComparisonExp>;
  imagePath?: InputMaybe<StringComparisonExp>;
  imageStorageProvider?: InputMaybe<StringComparisonExp>;
  mimeType?: InputMaybe<StringComparisonExp>;
  originalImageName?: InputMaybe<StringComparisonExp>;
  size?: InputMaybe<IntComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "bread_entry_images" */
export enum BreadEntryImagesConstraint {
  /** unique or primary key constraint on columns "id" */
  BreadEntryImagesPkey = 'bread_entry_images_pkey'
}

/** input type for incrementing numeric columns in table "bread_entry_images" */
export type BreadEntryImagesIncInput = {
  size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "bread_entry_images" */
export type BreadEntryImagesInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntry?: InputMaybe<BreadEntriesObjRelInsertInput>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  imageName?: InputMaybe<Scalars['String']['input']>;
  imagePath?: InputMaybe<Scalars['String']['input']>;
  imageStorageProvider?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalImageName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type BreadEntryImagesMaxFields = {
  __typename?: 'BreadEntryImagesMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  breadEntryId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  imageName?: Maybe<Scalars['String']['output']>;
  imagePath?: Maybe<Scalars['String']['output']>;
  imageStorageProvider?: Maybe<Scalars['String']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalImageName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "bread_entry_images" */
export type BreadEntryImagesMaxOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  breadEntryId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  imageName?: InputMaybe<OrderBy>;
  imagePath?: InputMaybe<OrderBy>;
  imageStorageProvider?: InputMaybe<OrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalImageName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type BreadEntryImagesMinFields = {
  __typename?: 'BreadEntryImagesMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  breadEntryId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  imageName?: Maybe<Scalars['String']['output']>;
  imagePath?: Maybe<Scalars['String']['output']>;
  imageStorageProvider?: Maybe<Scalars['String']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalImageName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "bread_entry_images" */
export type BreadEntryImagesMinOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  breadEntryId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  imageName?: InputMaybe<OrderBy>;
  imagePath?: InputMaybe<OrderBy>;
  imageStorageProvider?: InputMaybe<OrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalImageName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "bread_entry_images" */
export type BreadEntryImagesMutationResponse = {
  __typename?: 'BreadEntryImagesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<BreadEntryImages>;
};

/** on_conflict condition type for table "bread_entry_images" */
export type BreadEntryImagesOnConflict = {
  constraint: BreadEntryImagesConstraint;
  updateColumns?: Array<BreadEntryImagesUpdateColumn>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};

/** Ordering options when selecting data from "bread_entry_images". */
export type BreadEntryImagesOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  breadEntry?: InputMaybe<BreadEntriesOrderBy>;
  breadEntryId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  imageName?: InputMaybe<OrderBy>;
  imagePath?: InputMaybe<OrderBy>;
  imageStorageProvider?: InputMaybe<OrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalImageName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: bread_entry_images */
export type BreadEntryImagesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "bread_entry_images" */
export enum BreadEntryImagesSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  BreadEntryId = 'breadEntryId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  ImageName = 'imageName',
  /** column name */
  ImagePath = 'imagePath',
  /** column name */
  ImageStorageProvider = 'imageStorageProvider',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  OriginalImageName = 'originalImageName',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "bread_entry_images" */
export type BreadEntryImagesSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  imageName?: InputMaybe<Scalars['String']['input']>;
  imagePath?: InputMaybe<Scalars['String']['input']>;
  imageStorageProvider?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalImageName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type BreadEntryImagesStddevFields = {
  __typename?: 'BreadEntryImagesStddevFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "bread_entry_images" */
export type BreadEntryImagesStddevOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type BreadEntryImagesStddevPopFields = {
  __typename?: 'BreadEntryImagesStddevPopFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "bread_entry_images" */
export type BreadEntryImagesStddevPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type BreadEntryImagesStddevSampFields = {
  __typename?: 'BreadEntryImagesStddevSampFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "bread_entry_images" */
export type BreadEntryImagesStddevSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "bread_entry_images" */
export type BreadEntryImagesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: BreadEntryImagesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type BreadEntryImagesStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  imageName?: InputMaybe<Scalars['String']['input']>;
  imagePath?: InputMaybe<Scalars['String']['input']>;
  imageStorageProvider?: InputMaybe<Scalars['String']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalImageName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type BreadEntryImagesSumFields = {
  __typename?: 'BreadEntryImagesSumFields';
  size?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "bread_entry_images" */
export type BreadEntryImagesSumOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** update columns of table "bread_entry_images" */
export enum BreadEntryImagesUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  BreadEntryId = 'breadEntryId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  ImageName = 'imageName',
  /** column name */
  ImagePath = 'imagePath',
  /** column name */
  ImageStorageProvider = 'imageStorageProvider',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  OriginalImageName = 'originalImageName',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type BreadEntryImagesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<BreadEntryImagesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<BreadEntryImagesSetInput>;
  /** filter the rows which have to be updated */
  where: BreadEntryImagesBoolExp;
};

/** aggregate varPop on columns */
export type BreadEntryImagesVarPopFields = {
  __typename?: 'BreadEntryImagesVarPopFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "bread_entry_images" */
export type BreadEntryImagesVarPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type BreadEntryImagesVarSampFields = {
  __typename?: 'BreadEntryImagesVarSampFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "bread_entry_images" */
export type BreadEntryImagesVarSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type BreadEntryImagesVarianceFields = {
  __typename?: 'BreadEntryImagesVarianceFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "bread_entry_images" */
export type BreadEntryImagesVarianceOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** columns and relationships of "chat_message_files" */
export type ChatMessageFiles = {
  __typename?: 'ChatMessageFiles';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatMessageId: Scalars['uuid']['output'];
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  fileName: Scalars['String']['output'];
  filePath: Scalars['String']['output'];
  fileStorageProvider: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  /** An object relationship */
  message: ChatMessages;
  mimeType: Scalars['String']['output'];
  originalFileName: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};

/** aggregated selection of "chat_message_files" */
export type ChatMessageFilesAggregate = {
  __typename?: 'ChatMessageFilesAggregate';
  aggregate?: Maybe<ChatMessageFilesAggregateFields>;
  nodes: Array<ChatMessageFiles>;
};

export type ChatMessageFilesAggregateBoolExp = {
  count?: InputMaybe<ChatMessageFilesAggregateBoolExpCount>;
};

/** aggregate fields of "chat_message_files" */
export type ChatMessageFilesAggregateFields = {
  __typename?: 'ChatMessageFilesAggregateFields';
  avg?: Maybe<ChatMessageFilesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<ChatMessageFilesMaxFields>;
  min?: Maybe<ChatMessageFilesMinFields>;
  stddev?: Maybe<ChatMessageFilesStddevFields>;
  stddevPop?: Maybe<ChatMessageFilesStddevPopFields>;
  stddevSamp?: Maybe<ChatMessageFilesStddevSampFields>;
  sum?: Maybe<ChatMessageFilesSumFields>;
  varPop?: Maybe<ChatMessageFilesVarPopFields>;
  varSamp?: Maybe<ChatMessageFilesVarSampFields>;
  variance?: Maybe<ChatMessageFilesVarianceFields>;
};


/** aggregate fields of "chat_message_files" */
export type ChatMessageFilesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "chat_message_files" */
export type ChatMessageFilesAggregateOrderBy = {
  avg?: InputMaybe<ChatMessageFilesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ChatMessageFilesMaxOrderBy>;
  min?: InputMaybe<ChatMessageFilesMinOrderBy>;
  stddev?: InputMaybe<ChatMessageFilesStddevOrderBy>;
  stddevPop?: InputMaybe<ChatMessageFilesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ChatMessageFilesStddevSampOrderBy>;
  sum?: InputMaybe<ChatMessageFilesSumOrderBy>;
  varPop?: InputMaybe<ChatMessageFilesVarPopOrderBy>;
  varSamp?: InputMaybe<ChatMessageFilesVarSampOrderBy>;
  variance?: InputMaybe<ChatMessageFilesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "chat_message_files" */
export type ChatMessageFilesArrRelInsertInput = {
  data: Array<ChatMessageFilesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ChatMessageFilesOnConflict>;
};

/** aggregate avg on columns */
export type ChatMessageFilesAvgFields = {
  __typename?: 'ChatMessageFilesAvgFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "chat_message_files" */
export type ChatMessageFilesAvgOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "chat_message_files". All fields are combined with a logical 'AND'. */
export type ChatMessageFilesBoolExp = {
  _and?: InputMaybe<Array<ChatMessageFilesBoolExp>>;
  _not?: InputMaybe<ChatMessageFilesBoolExp>;
  _or?: InputMaybe<Array<ChatMessageFilesBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  chatMessageId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  fileName?: InputMaybe<StringComparisonExp>;
  filePath?: InputMaybe<StringComparisonExp>;
  fileStorageProvider?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  message?: InputMaybe<ChatMessagesBoolExp>;
  mimeType?: InputMaybe<StringComparisonExp>;
  originalFileName?: InputMaybe<StringComparisonExp>;
  size?: InputMaybe<IntComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "chat_message_files" */
export enum ChatMessageFilesConstraint {
  /** unique or primary key constraint on columns "id" */
  ChatMessageFilesPkey = 'chat_message_files_pkey'
}

/** input type for incrementing numeric columns in table "chat_message_files" */
export type ChatMessageFilesIncInput = {
  size?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "chat_message_files" */
export type ChatMessageFilesInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatMessageId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  fileStorageProvider?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  message?: InputMaybe<ChatMessagesObjRelInsertInput>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalFileName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type ChatMessageFilesMaxFields = {
  __typename?: 'ChatMessageFilesMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatMessageId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  fileStorageProvider?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalFileName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by max() on columns of table "chat_message_files" */
export type ChatMessageFilesMaxOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatMessageId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  fileName?: InputMaybe<OrderBy>;
  filePath?: InputMaybe<OrderBy>;
  fileStorageProvider?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalFileName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ChatMessageFilesMinFields = {
  __typename?: 'ChatMessageFilesMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatMessageId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  filePath?: Maybe<Scalars['String']['output']>;
  fileStorageProvider?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  originalFileName?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** order by min() on columns of table "chat_message_files" */
export type ChatMessageFilesMinOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatMessageId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  fileName?: InputMaybe<OrderBy>;
  filePath?: InputMaybe<OrderBy>;
  fileStorageProvider?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalFileName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "chat_message_files" */
export type ChatMessageFilesMutationResponse = {
  __typename?: 'ChatMessageFilesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ChatMessageFiles>;
};

/** on_conflict condition type for table "chat_message_files" */
export type ChatMessageFilesOnConflict = {
  constraint: ChatMessageFilesConstraint;
  updateColumns?: Array<ChatMessageFilesUpdateColumn>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};

/** Ordering options when selecting data from "chat_message_files". */
export type ChatMessageFilesOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatMessageId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  fileName?: InputMaybe<OrderBy>;
  filePath?: InputMaybe<OrderBy>;
  fileStorageProvider?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  message?: InputMaybe<ChatMessagesOrderBy>;
  mimeType?: InputMaybe<OrderBy>;
  originalFileName?: InputMaybe<OrderBy>;
  size?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: chat_message_files */
export type ChatMessageFilesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "chat_message_files" */
export enum ChatMessageFilesSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  ChatMessageId = 'chatMessageId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  FileName = 'fileName',
  /** column name */
  FilePath = 'filePath',
  /** column name */
  FileStorageProvider = 'fileStorageProvider',
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  OriginalFileName = 'originalFileName',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "chat_message_files" */
export type ChatMessageFilesSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatMessageId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  fileStorageProvider?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalFileName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate stddev on columns */
export type ChatMessageFilesStddevFields = {
  __typename?: 'ChatMessageFilesStddevFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "chat_message_files" */
export type ChatMessageFilesStddevOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type ChatMessageFilesStddevPopFields = {
  __typename?: 'ChatMessageFilesStddevPopFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "chat_message_files" */
export type ChatMessageFilesStddevPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type ChatMessageFilesStddevSampFields = {
  __typename?: 'ChatMessageFilesStddevSampFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "chat_message_files" */
export type ChatMessageFilesStddevSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "chat_message_files" */
export type ChatMessageFilesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ChatMessageFilesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ChatMessageFilesStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatMessageId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  filePath?: InputMaybe<Scalars['String']['input']>;
  fileStorageProvider?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  originalFileName?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate sum on columns */
export type ChatMessageFilesSumFields = {
  __typename?: 'ChatMessageFilesSumFields';
  size?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "chat_message_files" */
export type ChatMessageFilesSumOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** update columns of table "chat_message_files" */
export enum ChatMessageFilesUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  ChatMessageId = 'chatMessageId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  FileName = 'fileName',
  /** column name */
  FilePath = 'filePath',
  /** column name */
  FileStorageProvider = 'fileStorageProvider',
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  OriginalFileName = 'originalFileName',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type ChatMessageFilesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ChatMessageFilesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ChatMessageFilesSetInput>;
  /** filter the rows which have to be updated */
  where: ChatMessageFilesBoolExp;
};

/** aggregate varPop on columns */
export type ChatMessageFilesVarPopFields = {
  __typename?: 'ChatMessageFilesVarPopFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "chat_message_files" */
export type ChatMessageFilesVarPopOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type ChatMessageFilesVarSampFields = {
  __typename?: 'ChatMessageFilesVarSampFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "chat_message_files" */
export type ChatMessageFilesVarSampOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type ChatMessageFilesVarianceFields = {
  __typename?: 'ChatMessageFilesVarianceFields';
  size?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "chat_message_files" */
export type ChatMessageFilesVarianceOrderBy = {
  size?: InputMaybe<OrderBy>;
};

/** columns and relationships of "chat_messages" */
export type ChatMessages = {
  __typename?: 'ChatMessages';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatThreadId: Scalars['uuid']['output'];
  completionTokens: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  files: Array<ChatMessageFiles>;
  /** An aggregate relationship */
  filesAggregate: ChatMessageFilesAggregate;
  frequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  id: Scalars['uuid']['output'];
  model?: Maybe<Scalars['String']['output']>;
  presencePenalty?: Maybe<Scalars['numeric']['output']>;
  promptTokens: Scalars['Int']['output'];
  role: Scalars['String']['output'];
  temperature?: Maybe<Scalars['numeric']['output']>;
  /** An object relationship */
  thread: ChatThreads;
  topP?: Maybe<Scalars['numeric']['output']>;
  totalTokens: Scalars['Int']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
  userId?: Maybe<Scalars['uuid']['output']>;
};


/** columns and relationships of "chat_messages" */
export type ChatMessagesFilesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


/** columns and relationships of "chat_messages" */
export type ChatMessagesFilesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};

/** aggregated selection of "chat_messages" */
export type ChatMessagesAggregate = {
  __typename?: 'ChatMessagesAggregate';
  aggregate?: Maybe<ChatMessagesAggregateFields>;
  nodes: Array<ChatMessages>;
};

export type ChatMessagesAggregateBoolExp = {
  count?: InputMaybe<ChatMessagesAggregateBoolExpCount>;
};

/** aggregate fields of "chat_messages" */
export type ChatMessagesAggregateFields = {
  __typename?: 'ChatMessagesAggregateFields';
  avg?: Maybe<ChatMessagesAvgFields>;
  count: Scalars['Int']['output'];
  max?: Maybe<ChatMessagesMaxFields>;
  min?: Maybe<ChatMessagesMinFields>;
  stddev?: Maybe<ChatMessagesStddevFields>;
  stddevPop?: Maybe<ChatMessagesStddevPopFields>;
  stddevSamp?: Maybe<ChatMessagesStddevSampFields>;
  sum?: Maybe<ChatMessagesSumFields>;
  varPop?: Maybe<ChatMessagesVarPopFields>;
  varSamp?: Maybe<ChatMessagesVarSampFields>;
  variance?: Maybe<ChatMessagesVarianceFields>;
};


/** aggregate fields of "chat_messages" */
export type ChatMessagesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "chat_messages" */
export type ChatMessagesAggregateOrderBy = {
  avg?: InputMaybe<ChatMessagesAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ChatMessagesMaxOrderBy>;
  min?: InputMaybe<ChatMessagesMinOrderBy>;
  stddev?: InputMaybe<ChatMessagesStddevOrderBy>;
  stddevPop?: InputMaybe<ChatMessagesStddevPopOrderBy>;
  stddevSamp?: InputMaybe<ChatMessagesStddevSampOrderBy>;
  sum?: InputMaybe<ChatMessagesSumOrderBy>;
  varPop?: InputMaybe<ChatMessagesVarPopOrderBy>;
  varSamp?: InputMaybe<ChatMessagesVarSampOrderBy>;
  variance?: InputMaybe<ChatMessagesVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "chat_messages" */
export type ChatMessagesArrRelInsertInput = {
  data: Array<ChatMessagesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<ChatMessagesOnConflict>;
};

/** aggregate avg on columns */
export type ChatMessagesAvgFields = {
  __typename?: 'ChatMessagesAvgFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by avg() on columns of table "chat_messages" */
export type ChatMessagesAvgOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "chat_messages". All fields are combined with a logical 'AND'. */
export type ChatMessagesBoolExp = {
  _and?: InputMaybe<Array<ChatMessagesBoolExp>>;
  _not?: InputMaybe<ChatMessagesBoolExp>;
  _or?: InputMaybe<Array<ChatMessagesBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  chatThreadId?: InputMaybe<UuidComparisonExp>;
  completionTokens?: InputMaybe<IntComparisonExp>;
  content?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  files?: InputMaybe<ChatMessageFilesBoolExp>;
  filesAggregate?: InputMaybe<ChatMessageFilesAggregateBoolExp>;
  frequencyPenalty?: InputMaybe<NumericComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  model?: InputMaybe<StringComparisonExp>;
  presencePenalty?: InputMaybe<NumericComparisonExp>;
  promptTokens?: InputMaybe<IntComparisonExp>;
  role?: InputMaybe<StringComparisonExp>;
  temperature?: InputMaybe<NumericComparisonExp>;
  thread?: InputMaybe<ChatThreadsBoolExp>;
  topP?: InputMaybe<NumericComparisonExp>;
  totalTokens?: InputMaybe<IntComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "chat_messages" */
export enum ChatMessagesConstraint {
  /** unique or primary key constraint on columns "id" */
  ChatMessagesPkey = 'chat_messages_pkey'
}

/** input type for incrementing numeric columns in table "chat_messages" */
export type ChatMessagesIncInput = {
  completionTokens?: InputMaybe<Scalars['Int']['input']>;
  frequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  presencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  promptTokens?: InputMaybe<Scalars['Int']['input']>;
  temperature?: InputMaybe<Scalars['numeric']['input']>;
  topP?: InputMaybe<Scalars['numeric']['input']>;
  totalTokens?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "chat_messages" */
export type ChatMessagesInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatThreadId?: InputMaybe<Scalars['uuid']['input']>;
  completionTokens?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  files?: InputMaybe<ChatMessageFilesArrRelInsertInput>;
  frequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  presencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  promptTokens?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  temperature?: InputMaybe<Scalars['numeric']['input']>;
  thread?: InputMaybe<ChatThreadsObjRelInsertInput>;
  topP?: InputMaybe<Scalars['numeric']['input']>;
  totalTokens?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type ChatMessagesMaxFields = {
  __typename?: 'ChatMessagesMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatThreadId?: Maybe<Scalars['uuid']['output']>;
  completionTokens?: Maybe<Scalars['Int']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  frequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  presencePenalty?: Maybe<Scalars['numeric']['output']>;
  promptTokens?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['numeric']['output']>;
  topP?: Maybe<Scalars['numeric']['output']>;
  totalTokens?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "chat_messages" */
export type ChatMessagesMaxOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatThreadId?: InputMaybe<OrderBy>;
  completionTokens?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  model?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type ChatMessagesMinFields = {
  __typename?: 'ChatMessagesMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  chatThreadId?: Maybe<Scalars['uuid']['output']>;
  completionTokens?: Maybe<Scalars['Int']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  frequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  presencePenalty?: Maybe<Scalars['numeric']['output']>;
  promptTokens?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  temperature?: Maybe<Scalars['numeric']['output']>;
  topP?: Maybe<Scalars['numeric']['output']>;
  totalTokens?: Maybe<Scalars['Int']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "chat_messages" */
export type ChatMessagesMinOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatThreadId?: InputMaybe<OrderBy>;
  completionTokens?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  model?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "chat_messages" */
export type ChatMessagesMutationResponse = {
  __typename?: 'ChatMessagesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ChatMessages>;
};

/** input type for inserting object relation for remote table "chat_messages" */
export type ChatMessagesObjRelInsertInput = {
  data: ChatMessagesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ChatMessagesOnConflict>;
};

/** on_conflict condition type for table "chat_messages" */
export type ChatMessagesOnConflict = {
  constraint: ChatMessagesConstraint;
  updateColumns?: Array<ChatMessagesUpdateColumn>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};

/** Ordering options when selecting data from "chat_messages". */
export type ChatMessagesOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  chatThreadId?: InputMaybe<OrderBy>;
  completionTokens?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  filesAggregate?: InputMaybe<ChatMessageFilesAggregateOrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  model?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  role?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  thread?: InputMaybe<ChatThreadsOrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: chat_messages */
export type ChatMessagesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "chat_messages" */
export enum ChatMessagesSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  ChatThreadId = 'chatThreadId',
  /** column name */
  CompletionTokens = 'completionTokens',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  FrequencyPenalty = 'frequencyPenalty',
  /** column name */
  Id = 'id',
  /** column name */
  Model = 'model',
  /** column name */
  PresencePenalty = 'presencePenalty',
  /** column name */
  PromptTokens = 'promptTokens',
  /** column name */
  Role = 'role',
  /** column name */
  Temperature = 'temperature',
  /** column name */
  TopP = 'topP',
  /** column name */
  TotalTokens = 'totalTokens',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "chat_messages" */
export type ChatMessagesSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatThreadId?: InputMaybe<Scalars['uuid']['input']>;
  completionTokens?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  frequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  presencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  promptTokens?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  temperature?: InputMaybe<Scalars['numeric']['input']>;
  topP?: InputMaybe<Scalars['numeric']['input']>;
  totalTokens?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type ChatMessagesStddevFields = {
  __typename?: 'ChatMessagesStddevFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by stddev() on columns of table "chat_messages" */
export type ChatMessagesStddevOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** aggregate stddevPop on columns */
export type ChatMessagesStddevPopFields = {
  __typename?: 'ChatMessagesStddevPopFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevPop() on columns of table "chat_messages" */
export type ChatMessagesStddevPopOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** aggregate stddevSamp on columns */
export type ChatMessagesStddevSampFields = {
  __typename?: 'ChatMessagesStddevSampFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by stddevSamp() on columns of table "chat_messages" */
export type ChatMessagesStddevSampOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "chat_messages" */
export type ChatMessagesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ChatMessagesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ChatMessagesStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  chatThreadId?: InputMaybe<Scalars['uuid']['input']>;
  completionTokens?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  frequencyPenalty?: InputMaybe<Scalars['numeric']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  presencePenalty?: InputMaybe<Scalars['numeric']['input']>;
  promptTokens?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  temperature?: InputMaybe<Scalars['numeric']['input']>;
  topP?: InputMaybe<Scalars['numeric']['input']>;
  totalTokens?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type ChatMessagesSumFields = {
  __typename?: 'ChatMessagesSumFields';
  completionTokens?: Maybe<Scalars['Int']['output']>;
  frequencyPenalty?: Maybe<Scalars['numeric']['output']>;
  presencePenalty?: Maybe<Scalars['numeric']['output']>;
  promptTokens?: Maybe<Scalars['Int']['output']>;
  temperature?: Maybe<Scalars['numeric']['output']>;
  topP?: Maybe<Scalars['numeric']['output']>;
  totalTokens?: Maybe<Scalars['Int']['output']>;
};

/** order by sum() on columns of table "chat_messages" */
export type ChatMessagesSumOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** update columns of table "chat_messages" */
export enum ChatMessagesUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  ChatThreadId = 'chatThreadId',
  /** column name */
  CompletionTokens = 'completionTokens',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  FrequencyPenalty = 'frequencyPenalty',
  /** column name */
  Id = 'id',
  /** column name */
  Model = 'model',
  /** column name */
  PresencePenalty = 'presencePenalty',
  /** column name */
  PromptTokens = 'promptTokens',
  /** column name */
  Role = 'role',
  /** column name */
  Temperature = 'temperature',
  /** column name */
  TopP = 'topP',
  /** column name */
  TotalTokens = 'totalTokens',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type ChatMessagesUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ChatMessagesIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ChatMessagesSetInput>;
  /** filter the rows which have to be updated */
  where: ChatMessagesBoolExp;
};

/** aggregate varPop on columns */
export type ChatMessagesVarPopFields = {
  __typename?: 'ChatMessagesVarPopFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by varPop() on columns of table "chat_messages" */
export type ChatMessagesVarPopOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** aggregate varSamp on columns */
export type ChatMessagesVarSampFields = {
  __typename?: 'ChatMessagesVarSampFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by varSamp() on columns of table "chat_messages" */
export type ChatMessagesVarSampOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type ChatMessagesVarianceFields = {
  __typename?: 'ChatMessagesVarianceFields';
  completionTokens?: Maybe<Scalars['Float']['output']>;
  frequencyPenalty?: Maybe<Scalars['Float']['output']>;
  presencePenalty?: Maybe<Scalars['Float']['output']>;
  promptTokens?: Maybe<Scalars['Float']['output']>;
  temperature?: Maybe<Scalars['Float']['output']>;
  topP?: Maybe<Scalars['Float']['output']>;
  totalTokens?: Maybe<Scalars['Float']['output']>;
};

/** order by variance() on columns of table "chat_messages" */
export type ChatMessagesVarianceOrderBy = {
  completionTokens?: InputMaybe<OrderBy>;
  frequencyPenalty?: InputMaybe<OrderBy>;
  presencePenalty?: InputMaybe<OrderBy>;
  promptTokens?: InputMaybe<OrderBy>;
  temperature?: InputMaybe<OrderBy>;
  topP?: InputMaybe<OrderBy>;
  totalTokens?: InputMaybe<OrderBy>;
};

/** columns and relationships of "chat_threads" */
export type ChatThreads = {
  __typename?: 'ChatThreads';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An object relationship */
  breadEntry?: Maybe<BreadEntries>;
  breadEntryId?: Maybe<Scalars['uuid']['output']>;
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  /** An array relationship */
  messages: Array<ChatMessages>;
  /** An aggregate relationship */
  messagesAggregate: ChatMessagesAggregate;
  title: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};


/** columns and relationships of "chat_threads" */
export type ChatThreadsMessagesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


/** columns and relationships of "chat_threads" */
export type ChatThreadsMessagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};

/** aggregated selection of "chat_threads" */
export type ChatThreadsAggregate = {
  __typename?: 'ChatThreadsAggregate';
  aggregate?: Maybe<ChatThreadsAggregateFields>;
  nodes: Array<ChatThreads>;
};

/** aggregate fields of "chat_threads" */
export type ChatThreadsAggregateFields = {
  __typename?: 'ChatThreadsAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<ChatThreadsMaxFields>;
  min?: Maybe<ChatThreadsMinFields>;
};


/** aggregate fields of "chat_threads" */
export type ChatThreadsAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<ChatThreadsSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "chat_threads". All fields are combined with a logical 'AND'. */
export type ChatThreadsBoolExp = {
  _and?: InputMaybe<Array<ChatThreadsBoolExp>>;
  _not?: InputMaybe<ChatThreadsBoolExp>;
  _or?: InputMaybe<Array<ChatThreadsBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  breadEntry?: InputMaybe<BreadEntriesBoolExp>;
  breadEntryId?: InputMaybe<UuidComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  messages?: InputMaybe<ChatMessagesBoolExp>;
  messagesAggregate?: InputMaybe<ChatMessagesAggregateBoolExp>;
  title?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "chat_threads" */
export enum ChatThreadsConstraint {
  /** unique or primary key constraint on columns "id" */
  ChatThreadsPkey = 'chat_threads_pkey'
}

/** input type for inserting data into table "chat_threads" */
export type ChatThreadsInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntry?: InputMaybe<BreadEntriesObjRelInsertInput>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  messages?: InputMaybe<ChatMessagesArrRelInsertInput>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type ChatThreadsMaxFields = {
  __typename?: 'ChatThreadsMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  breadEntryId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type ChatThreadsMinFields = {
  __typename?: 'ChatThreadsMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  breadEntryId?: Maybe<Scalars['uuid']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "chat_threads" */
export type ChatThreadsMutationResponse = {
  __typename?: 'ChatThreadsMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<ChatThreads>;
};

/** input type for inserting object relation for remote table "chat_threads" */
export type ChatThreadsObjRelInsertInput = {
  data: ChatThreadsInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<ChatThreadsOnConflict>;
};

/** on_conflict condition type for table "chat_threads" */
export type ChatThreadsOnConflict = {
  constraint: ChatThreadsConstraint;
  updateColumns?: Array<ChatThreadsUpdateColumn>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};

/** Ordering options when selecting data from "chat_threads". */
export type ChatThreadsOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  breadEntry?: InputMaybe<BreadEntriesOrderBy>;
  breadEntryId?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  messagesAggregate?: InputMaybe<ChatMessagesAggregateOrderBy>;
  title?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: chat_threads */
export type ChatThreadsPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "chat_threads" */
export enum ChatThreadsSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  BreadEntryId = 'breadEntryId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "chat_threads" */
export type ChatThreadsSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "chat_threads" */
export type ChatThreadsStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: ChatThreadsStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ChatThreadsStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntryId?: InputMaybe<Scalars['uuid']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "chat_threads" */
export enum ChatThreadsUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  BreadEntryId = 'breadEntryId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type ChatThreadsUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ChatThreadsSetInput>;
  /** filter the rows which have to be updated */
  where: ChatThreadsBoolExp;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type NumericComparisonExp = {
  _eq?: InputMaybe<Scalars['numeric']['input']>;
  _gt?: InputMaybe<Scalars['numeric']['input']>;
  _gte?: InputMaybe<Scalars['numeric']['input']>;
  _in?: InputMaybe<Array<Scalars['numeric']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['numeric']['input']>;
  _lte?: InputMaybe<Scalars['numeric']['input']>;
  _neq?: InputMaybe<Scalars['numeric']['input']>;
  _nin?: InputMaybe<Array<Scalars['numeric']['input']>>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'ASC',
  /** in ascending order, nulls first */
  AscNullsFirst = 'ASC_NULLS_FIRST',
  /** in ascending order, nulls last */
  AscNullsLast = 'ASC_NULLS_LAST',
  /** in descending order, nulls first */
  Desc = 'DESC',
  /** in descending order, nulls first */
  DescNullsFirst = 'DESC_NULLS_FIRST',
  /** in descending order, nulls last */
  DescNullsLast = 'DESC_NULLS_LAST'
}

/** columns and relationships of "recipe_notes" */
export type RecipeNotes = {
  __typename?: 'RecipeNotes';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  /** An object relationship */
  recipe: Recipes;
  recipeId: Scalars['uuid']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid']['output'];
};

/** aggregated selection of "recipe_notes" */
export type RecipeNotesAggregate = {
  __typename?: 'RecipeNotesAggregate';
  aggregate?: Maybe<RecipeNotesAggregateFields>;
  nodes: Array<RecipeNotes>;
};

export type RecipeNotesAggregateBoolExp = {
  count?: InputMaybe<RecipeNotesAggregateBoolExpCount>;
};

/** aggregate fields of "recipe_notes" */
export type RecipeNotesAggregateFields = {
  __typename?: 'RecipeNotesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<RecipeNotesMaxFields>;
  min?: Maybe<RecipeNotesMinFields>;
};


/** aggregate fields of "recipe_notes" */
export type RecipeNotesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "recipe_notes" */
export type RecipeNotesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RecipeNotesMaxOrderBy>;
  min?: InputMaybe<RecipeNotesMinOrderBy>;
};

/** input type for inserting array relation for remote table "recipe_notes" */
export type RecipeNotesArrRelInsertInput = {
  data: Array<RecipeNotesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<RecipeNotesOnConflict>;
};

/** Boolean expression to filter rows from the table "recipe_notes". All fields are combined with a logical 'AND'. */
export type RecipeNotesBoolExp = {
  _and?: InputMaybe<Array<RecipeNotesBoolExp>>;
  _not?: InputMaybe<RecipeNotesBoolExp>;
  _or?: InputMaybe<Array<RecipeNotesBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  content?: InputMaybe<StringComparisonExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  recipe?: InputMaybe<RecipesBoolExp>;
  recipeId?: InputMaybe<UuidComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "recipe_notes" */
export enum RecipeNotesConstraint {
  /** unique or primary key constraint on columns "id" */
  RecipeNotesPkey = 'recipe_notes_pkey'
}

/** input type for inserting data into table "recipe_notes" */
export type RecipeNotesInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipe?: InputMaybe<RecipesObjRelInsertInput>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type RecipeNotesMaxFields = {
  __typename?: 'RecipeNotesMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  recipeId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by max() on columns of table "recipe_notes" */
export type RecipeNotesMaxOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RecipeNotesMinFields = {
  __typename?: 'RecipeNotesMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  recipeId?: Maybe<Scalars['uuid']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
};

/** order by min() on columns of table "recipe_notes" */
export type RecipeNotesMinOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "recipe_notes" */
export type RecipeNotesMutationResponse = {
  __typename?: 'RecipeNotesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<RecipeNotes>;
};

/** on_conflict condition type for table "recipe_notes" */
export type RecipeNotesOnConflict = {
  constraint: RecipeNotesConstraint;
  updateColumns?: Array<RecipeNotesUpdateColumn>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};

/** Ordering options when selecting data from "recipe_notes". */
export type RecipeNotesOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  content?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  recipe?: InputMaybe<RecipesOrderBy>;
  recipeId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: recipe_notes */
export type RecipeNotesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "recipe_notes" */
export enum RecipeNotesSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  RecipeId = 'recipeId',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "recipe_notes" */
export type RecipeNotesSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "recipe_notes" */
export type RecipeNotesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RecipeNotesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RecipeNotesStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  recipeId?: InputMaybe<Scalars['uuid']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "recipe_notes" */
export enum RecipeNotesUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Id = 'id',
  /** column name */
  RecipeId = 'recipeId',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type RecipeNotesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RecipeNotesSetInput>;
  /** filter the rows which have to be updated */
  where: RecipeNotesBoolExp;
};

/** columns and relationships of "recipes" */
export type Recipes = {
  __typename?: 'Recipes';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  /** An array relationship */
  breadEntries: Array<BreadEntries>;
  /** An aggregate relationship */
  breadEntriesAggregate: BreadEntriesAggregate;
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  flour: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  ingredients: Scalars['String']['output'];
  instructions: Scalars['String']['output'];
  lastUsedAt: Scalars['timestamptz']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  notes: Array<RecipeNotes>;
  /** An aggregate relationship */
  notesAggregate: RecipeNotesAggregate;
  remarks: Scalars['String']['output'];
  salt: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
  url: Scalars['String']['output'];
  /** An object relationship */
  user?: Maybe<Users>;
  userId?: Maybe<Scalars['uuid']['output']>;
  water: Scalars['String']['output'];
};


/** columns and relationships of "recipes" */
export type RecipesBreadEntriesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


/** columns and relationships of "recipes" */
export type RecipesBreadEntriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


/** columns and relationships of "recipes" */
export type RecipesNotesArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


/** columns and relationships of "recipes" */
export type RecipesNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};

/** aggregated selection of "recipes" */
export type RecipesAggregate = {
  __typename?: 'RecipesAggregate';
  aggregate?: Maybe<RecipesAggregateFields>;
  nodes: Array<Recipes>;
};

export type RecipesAggregateBoolExp = {
  count?: InputMaybe<RecipesAggregateBoolExpCount>;
};

/** aggregate fields of "recipes" */
export type RecipesAggregateFields = {
  __typename?: 'RecipesAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<RecipesMaxFields>;
  min?: Maybe<RecipesMinFields>;
};


/** aggregate fields of "recipes" */
export type RecipesAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<RecipesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** order by aggregate values of table "recipes" */
export type RecipesAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RecipesMaxOrderBy>;
  min?: InputMaybe<RecipesMinOrderBy>;
};

/** input type for inserting array relation for remote table "recipes" */
export type RecipesArrRelInsertInput = {
  data: Array<RecipesInsertInput>;
  /** upsert condition */
  onConflict?: InputMaybe<RecipesOnConflict>;
};

/** Boolean expression to filter rows from the table "recipes". All fields are combined with a logical 'AND'. */
export type RecipesBoolExp = {
  _and?: InputMaybe<Array<RecipesBoolExp>>;
  _not?: InputMaybe<RecipesBoolExp>;
  _or?: InputMaybe<Array<RecipesBoolExp>>;
  archivedAt?: InputMaybe<TimestamptzComparisonExp>;
  breadEntries?: InputMaybe<BreadEntriesBoolExp>;
  breadEntriesAggregate?: InputMaybe<BreadEntriesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  flour?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  ingredients?: InputMaybe<StringComparisonExp>;
  instructions?: InputMaybe<StringComparisonExp>;
  lastUsedAt?: InputMaybe<TimestamptzComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  notes?: InputMaybe<RecipeNotesBoolExp>;
  notesAggregate?: InputMaybe<RecipeNotesAggregateBoolExp>;
  remarks?: InputMaybe<StringComparisonExp>;
  salt?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
  url?: InputMaybe<StringComparisonExp>;
  user?: InputMaybe<UsersBoolExp>;
  userId?: InputMaybe<UuidComparisonExp>;
  water?: InputMaybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "recipes" */
export enum RecipesConstraint {
  /** unique or primary key constraint on columns "id" */
  RecipesPkey = 'recipes_pkey'
}

/** input type for inserting data into table "recipes" */
export type RecipesInsertInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  breadEntries?: InputMaybe<BreadEntriesArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  flour?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  lastUsedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<RecipeNotesArrRelInsertInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UsersObjRelInsertInput>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  water?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type RecipesMaxFields = {
  __typename?: 'RecipesMaxFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  flour?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  ingredients?: Maybe<Scalars['String']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
  lastUsedAt?: Maybe<Scalars['timestamptz']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  water?: Maybe<Scalars['String']['output']>;
};

/** order by max() on columns of table "recipes" */
export type RecipesMaxOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  flour?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ingredients?: InputMaybe<OrderBy>;
  instructions?: InputMaybe<OrderBy>;
  lastUsedAt?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  remarks?: InputMaybe<OrderBy>;
  salt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  water?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RecipesMinFields = {
  __typename?: 'RecipesMinFields';
  archivedAt?: Maybe<Scalars['timestamptz']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  flour?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  ingredients?: Maybe<Scalars['String']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
  lastUsedAt?: Maybe<Scalars['timestamptz']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  salt?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['uuid']['output']>;
  water?: Maybe<Scalars['String']['output']>;
};

/** order by min() on columns of table "recipes" */
export type RecipesMinOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  flour?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ingredients?: InputMaybe<OrderBy>;
  instructions?: InputMaybe<OrderBy>;
  lastUsedAt?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  remarks?: InputMaybe<OrderBy>;
  salt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  userId?: InputMaybe<OrderBy>;
  water?: InputMaybe<OrderBy>;
};

/** response of any mutation on the table "recipes" */
export type RecipesMutationResponse = {
  __typename?: 'RecipesMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Recipes>;
};

/** input type for inserting object relation for remote table "recipes" */
export type RecipesObjRelInsertInput = {
  data: RecipesInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<RecipesOnConflict>;
};

/** on_conflict condition type for table "recipes" */
export type RecipesOnConflict = {
  constraint: RecipesConstraint;
  updateColumns?: Array<RecipesUpdateColumn>;
  where?: InputMaybe<RecipesBoolExp>;
};

/** Ordering options when selecting data from "recipes". */
export type RecipesOrderBy = {
  archivedAt?: InputMaybe<OrderBy>;
  breadEntriesAggregate?: InputMaybe<BreadEntriesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  flour?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  ingredients?: InputMaybe<OrderBy>;
  instructions?: InputMaybe<OrderBy>;
  lastUsedAt?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  notesAggregate?: InputMaybe<RecipeNotesAggregateOrderBy>;
  remarks?: InputMaybe<OrderBy>;
  salt?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
  url?: InputMaybe<OrderBy>;
  user?: InputMaybe<UsersOrderBy>;
  userId?: InputMaybe<OrderBy>;
  water?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: recipes */
export type RecipesPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "recipes" */
export enum RecipesSelectColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Flour = 'flour',
  /** column name */
  Id = 'id',
  /** column name */
  Ingredients = 'ingredients',
  /** column name */
  Instructions = 'instructions',
  /** column name */
  LastUsedAt = 'lastUsedAt',
  /** column name */
  Name = 'name',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  Salt = 'salt',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Url = 'url',
  /** column name */
  UserId = 'userId',
  /** column name */
  Water = 'water'
}

/** input type for updating data in table "recipes" */
export type RecipesSetInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  flour?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  lastUsedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  water?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "recipes" */
export type RecipesStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: RecipesStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RecipesStreamCursorValueInput = {
  archivedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  flour?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  ingredients?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  lastUsedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['uuid']['input']>;
  water?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "recipes" */
export enum RecipesUpdateColumn {
  /** column name */
  ArchivedAt = 'archivedAt',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Flour = 'flour',
  /** column name */
  Id = 'id',
  /** column name */
  Ingredients = 'ingredients',
  /** column name */
  Instructions = 'instructions',
  /** column name */
  LastUsedAt = 'lastUsedAt',
  /** column name */
  Name = 'name',
  /** column name */
  Remarks = 'remarks',
  /** column name */
  Salt = 'salt',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  Url = 'url',
  /** column name */
  UserId = 'userId',
  /** column name */
  Water = 'water'
}

export type RecipesUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RecipesSetInput>;
  /** filter the rows which have to be updated */
  where: RecipesBoolExp;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'Users';
  birthDate?: Maybe<Scalars['date']['output']>;
  /** An array relationship */
  breadEntries: Array<BreadEntries>;
  /** An aggregate relationship */
  breadEntriesAggregate: BreadEntriesAggregate;
  createdAt: Scalars['timestamptz']['output'];
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  /** An array relationship */
  recipeNotes: Array<RecipeNotes>;
  /** An aggregate relationship */
  recipeNotesAggregate: RecipeNotesAggregate;
  /** An array relationship */
  recipes: Array<Recipes>;
  /** An aggregate relationship */
  recipesAggregate: RecipesAggregate;
  stripeCustomerId: Scalars['String']['output'];
  updatedAt: Scalars['timestamptz']['output'];
};


/** columns and relationships of "users" */
export type UsersBreadEntriesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersBreadEntriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersRecipeNotesArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersRecipeNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersRecipesArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};


/** columns and relationships of "users" */
export type UsersRecipesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};

/** aggregated selection of "users" */
export type UsersAggregate = {
  __typename?: 'UsersAggregate';
  aggregate?: Maybe<UsersAggregateFields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type UsersAggregateFields = {
  __typename?: 'UsersAggregateFields';
  count: Scalars['Int']['output'];
  max?: Maybe<UsersMaxFields>;
  min?: Maybe<UsersMinFields>;
};


/** aggregate fields of "users" */
export type UsersAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<UsersSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type UsersBoolExp = {
  _and?: InputMaybe<Array<UsersBoolExp>>;
  _not?: InputMaybe<UsersBoolExp>;
  _or?: InputMaybe<Array<UsersBoolExp>>;
  birthDate?: InputMaybe<DateComparisonExp>;
  breadEntries?: InputMaybe<BreadEntriesBoolExp>;
  breadEntriesAggregate?: InputMaybe<BreadEntriesAggregateBoolExp>;
  createdAt?: InputMaybe<TimestamptzComparisonExp>;
  deletedAt?: InputMaybe<TimestamptzComparisonExp>;
  email?: InputMaybe<StringComparisonExp>;
  id?: InputMaybe<UuidComparisonExp>;
  name?: InputMaybe<StringComparisonExp>;
  recipeNotes?: InputMaybe<RecipeNotesBoolExp>;
  recipeNotesAggregate?: InputMaybe<RecipeNotesAggregateBoolExp>;
  recipes?: InputMaybe<RecipesBoolExp>;
  recipesAggregate?: InputMaybe<RecipesAggregateBoolExp>;
  stripeCustomerId?: InputMaybe<StringComparisonExp>;
  updatedAt?: InputMaybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "users" */
export enum UsersConstraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
  /** unique or primary key constraint on columns "stripe_customer_id" */
  UsersStripeCustomerIdKey = 'users_stripe_customer_id_key'
}

/** input type for inserting data into table "users" */
export type UsersInsertInput = {
  birthDate?: InputMaybe<Scalars['date']['input']>;
  breadEntries?: InputMaybe<BreadEntriesArrRelInsertInput>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recipeNotes?: InputMaybe<RecipeNotesArrRelInsertInput>;
  recipes?: InputMaybe<RecipesArrRelInsertInput>;
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type UsersMaxFields = {
  __typename?: 'UsersMaxFields';
  birthDate?: Maybe<Scalars['date']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type UsersMinFields = {
  __typename?: 'UsersMinFields';
  birthDate?: Maybe<Scalars['date']['output']>;
  createdAt?: Maybe<Scalars['timestamptz']['output']>;
  deletedAt?: Maybe<Scalars['timestamptz']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  stripeCustomerId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "users" */
export type UsersMutationResponse = {
  __typename?: 'UsersMutationResponse';
  /** number of rows affected by the mutation */
  affectedRows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type UsersObjRelInsertInput = {
  data: UsersInsertInput;
  /** upsert condition */
  onConflict?: InputMaybe<UsersOnConflict>;
};

/** on_conflict condition type for table "users" */
export type UsersOnConflict = {
  constraint: UsersConstraint;
  updateColumns?: Array<UsersUpdateColumn>;
  where?: InputMaybe<UsersBoolExp>;
};

/** Ordering options when selecting data from "users". */
export type UsersOrderBy = {
  birthDate?: InputMaybe<OrderBy>;
  breadEntriesAggregate?: InputMaybe<BreadEntriesAggregateOrderBy>;
  createdAt?: InputMaybe<OrderBy>;
  deletedAt?: InputMaybe<OrderBy>;
  email?: InputMaybe<OrderBy>;
  id?: InputMaybe<OrderBy>;
  name?: InputMaybe<OrderBy>;
  recipeNotesAggregate?: InputMaybe<RecipeNotesAggregateOrderBy>;
  recipesAggregate?: InputMaybe<RecipesAggregateOrderBy>;
  stripeCustomerId?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: users */
export type UsersPkColumnsInput = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "users" */
export enum UsersSelectColumn {
  /** column name */
  BirthDate = 'birthDate',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  StripeCustomerId = 'stripeCustomerId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "users" */
export type UsersSetInput = {
  birthDate?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "users" */
export type UsersStreamCursorInput = {
  /** Stream column input with initial value */
  initialValue: UsersStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type UsersStreamCursorValueInput = {
  birthDate?: InputMaybe<Scalars['date']['input']>;
  createdAt?: InputMaybe<Scalars['timestamptz']['input']>;
  deletedAt?: InputMaybe<Scalars['timestamptz']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  stripeCustomerId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "users" */
export enum UsersUpdateColumn {
  /** column name */
  BirthDate = 'birthDate',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DeletedAt = 'deletedAt',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  StripeCustomerId = 'stripeCustomerId',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type UsersUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UsersSetInput>;
  /** filter the rows which have to be updated */
  where: UsersBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _isNull?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
};

export type BreadEntriesAggregateBoolExpBool_And = {
  arguments: BreadEntriesSelectColumnBreadEntriesAggregateBoolExpBool_AndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BreadEntriesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type BreadEntriesAggregateBoolExpBool_Or = {
  arguments: BreadEntriesSelectColumnBreadEntriesAggregateBoolExpBool_OrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BreadEntriesBoolExp>;
  predicate: BooleanComparisonExp;
};

export type BreadEntriesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BreadEntriesBoolExp>;
  predicate: IntComparisonExp;
};

export type BreadEntryImagesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<BreadEntryImagesBoolExp>;
  predicate: IntComparisonExp;
};

export type ChatMessageFilesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ChatMessageFilesBoolExp>;
  predicate: IntComparisonExp;
};

export type ChatMessagesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<ChatMessagesBoolExp>;
  predicate: IntComparisonExp;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "bread_entries" */
  deleteBreadEntries?: Maybe<BreadEntriesMutationResponse>;
  /** delete single row from the table: "bread_entries" */
  deleteBreadEntriesByPk?: Maybe<BreadEntries>;
  /** delete data from the table: "bread_entry_images" */
  deleteBreadEntryImages?: Maybe<BreadEntryImagesMutationResponse>;
  /** delete single row from the table: "bread_entry_images" */
  deleteBreadEntryImagesByPk?: Maybe<BreadEntryImages>;
  /** delete data from the table: "chat_message_files" */
  deleteChatMessageFiles?: Maybe<ChatMessageFilesMutationResponse>;
  /** delete single row from the table: "chat_message_files" */
  deleteChatMessageFilesByPk?: Maybe<ChatMessageFiles>;
  /** delete data from the table: "chat_messages" */
  deleteChatMessages?: Maybe<ChatMessagesMutationResponse>;
  /** delete single row from the table: "chat_messages" */
  deleteChatMessagesByPk?: Maybe<ChatMessages>;
  /** delete data from the table: "chat_threads" */
  deleteChatThreads?: Maybe<ChatThreadsMutationResponse>;
  /** delete single row from the table: "chat_threads" */
  deleteChatThreadsByPk?: Maybe<ChatThreads>;
  /** delete data from the table: "recipe_notes" */
  deleteRecipeNotes?: Maybe<RecipeNotesMutationResponse>;
  /** delete single row from the table: "recipe_notes" */
  deleteRecipeNotesByPk?: Maybe<RecipeNotes>;
  /** delete data from the table: "recipes" */
  deleteRecipes?: Maybe<RecipesMutationResponse>;
  /** delete single row from the table: "recipes" */
  deleteRecipesByPk?: Maybe<Recipes>;
  /** delete data from the table: "users" */
  deleteUsers?: Maybe<UsersMutationResponse>;
  /** delete single row from the table: "users" */
  deleteUsersByPk?: Maybe<Users>;
  /** insert data into the table: "bread_entries" */
  insertBreadEntries?: Maybe<BreadEntriesMutationResponse>;
  /** insert a single row into the table: "bread_entries" */
  insertBreadEntriesOne?: Maybe<BreadEntries>;
  /** insert data into the table: "bread_entry_images" */
  insertBreadEntryImages?: Maybe<BreadEntryImagesMutationResponse>;
  /** insert a single row into the table: "bread_entry_images" */
  insertBreadEntryImagesOne?: Maybe<BreadEntryImages>;
  /** insert data into the table: "chat_message_files" */
  insertChatMessageFiles?: Maybe<ChatMessageFilesMutationResponse>;
  /** insert a single row into the table: "chat_message_files" */
  insertChatMessageFilesOne?: Maybe<ChatMessageFiles>;
  /** insert data into the table: "chat_messages" */
  insertChatMessages?: Maybe<ChatMessagesMutationResponse>;
  /** insert a single row into the table: "chat_messages" */
  insertChatMessagesOne?: Maybe<ChatMessages>;
  /** insert data into the table: "chat_threads" */
  insertChatThreads?: Maybe<ChatThreadsMutationResponse>;
  /** insert a single row into the table: "chat_threads" */
  insertChatThreadsOne?: Maybe<ChatThreads>;
  /** insert data into the table: "recipe_notes" */
  insertRecipeNotes?: Maybe<RecipeNotesMutationResponse>;
  /** insert a single row into the table: "recipe_notes" */
  insertRecipeNotesOne?: Maybe<RecipeNotes>;
  /** insert data into the table: "recipes" */
  insertRecipes?: Maybe<RecipesMutationResponse>;
  /** insert a single row into the table: "recipes" */
  insertRecipesOne?: Maybe<Recipes>;
  /** insert data into the table: "users" */
  insertUsers?: Maybe<UsersMutationResponse>;
  /** insert a single row into the table: "users" */
  insertUsersOne?: Maybe<Users>;
  /** update data of the table: "bread_entries" */
  updateBreadEntries?: Maybe<BreadEntriesMutationResponse>;
  /** update single row of the table: "bread_entries" */
  updateBreadEntriesByPk?: Maybe<BreadEntries>;
  /** update multiples rows of table: "bread_entries" */
  updateBreadEntriesMany?: Maybe<Array<Maybe<BreadEntriesMutationResponse>>>;
  /** update data of the table: "bread_entry_images" */
  updateBreadEntryImages?: Maybe<BreadEntryImagesMutationResponse>;
  /** update single row of the table: "bread_entry_images" */
  updateBreadEntryImagesByPk?: Maybe<BreadEntryImages>;
  /** update multiples rows of table: "bread_entry_images" */
  updateBreadEntryImagesMany?: Maybe<Array<Maybe<BreadEntryImagesMutationResponse>>>;
  /** update data of the table: "chat_message_files" */
  updateChatMessageFiles?: Maybe<ChatMessageFilesMutationResponse>;
  /** update single row of the table: "chat_message_files" */
  updateChatMessageFilesByPk?: Maybe<ChatMessageFiles>;
  /** update multiples rows of table: "chat_message_files" */
  updateChatMessageFilesMany?: Maybe<Array<Maybe<ChatMessageFilesMutationResponse>>>;
  /** update data of the table: "chat_messages" */
  updateChatMessages?: Maybe<ChatMessagesMutationResponse>;
  /** update single row of the table: "chat_messages" */
  updateChatMessagesByPk?: Maybe<ChatMessages>;
  /** update multiples rows of table: "chat_messages" */
  updateChatMessagesMany?: Maybe<Array<Maybe<ChatMessagesMutationResponse>>>;
  /** update data of the table: "chat_threads" */
  updateChatThreads?: Maybe<ChatThreadsMutationResponse>;
  /** update single row of the table: "chat_threads" */
  updateChatThreadsByPk?: Maybe<ChatThreads>;
  /** update multiples rows of table: "chat_threads" */
  updateChatThreadsMany?: Maybe<Array<Maybe<ChatThreadsMutationResponse>>>;
  /** update data of the table: "recipe_notes" */
  updateRecipeNotes?: Maybe<RecipeNotesMutationResponse>;
  /** update single row of the table: "recipe_notes" */
  updateRecipeNotesByPk?: Maybe<RecipeNotes>;
  /** update multiples rows of table: "recipe_notes" */
  updateRecipeNotesMany?: Maybe<Array<Maybe<RecipeNotesMutationResponse>>>;
  /** update data of the table: "recipes" */
  updateRecipes?: Maybe<RecipesMutationResponse>;
  /** update single row of the table: "recipes" */
  updateRecipesByPk?: Maybe<Recipes>;
  /** update multiples rows of table: "recipes" */
  updateRecipesMany?: Maybe<Array<Maybe<RecipesMutationResponse>>>;
  /** update data of the table: "users" */
  updateUsers?: Maybe<UsersMutationResponse>;
  /** update single row of the table: "users" */
  updateUsersByPk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  updateUsersMany?: Maybe<Array<Maybe<UsersMutationResponse>>>;
};


/** mutation root */
export type Mutation_RootDeleteBreadEntriesArgs = {
  where: BreadEntriesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteBreadEntriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteBreadEntryImagesArgs = {
  where: BreadEntryImagesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteBreadEntryImagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteChatMessageFilesArgs = {
  where: ChatMessageFilesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteChatMessageFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteChatMessagesArgs = {
  where: ChatMessagesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteChatMessagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteChatThreadsArgs = {
  where: ChatThreadsBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteChatThreadsByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteRecipeNotesArgs = {
  where: RecipeNotesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteRecipeNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteRecipesArgs = {
  where: RecipesBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteRecipesByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDeleteUsersArgs = {
  where: UsersBoolExp;
};


/** mutation root */
export type Mutation_RootDeleteUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootInsertBreadEntriesArgs = {
  objects: Array<BreadEntriesInsertInput>;
  onConflict?: InputMaybe<BreadEntriesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBreadEntriesOneArgs = {
  object: BreadEntriesInsertInput;
  onConflict?: InputMaybe<BreadEntriesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBreadEntryImagesArgs = {
  objects: Array<BreadEntryImagesInsertInput>;
  onConflict?: InputMaybe<BreadEntryImagesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertBreadEntryImagesOneArgs = {
  object: BreadEntryImagesInsertInput;
  onConflict?: InputMaybe<BreadEntryImagesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatMessageFilesArgs = {
  objects: Array<ChatMessageFilesInsertInput>;
  onConflict?: InputMaybe<ChatMessageFilesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatMessageFilesOneArgs = {
  object: ChatMessageFilesInsertInput;
  onConflict?: InputMaybe<ChatMessageFilesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatMessagesArgs = {
  objects: Array<ChatMessagesInsertInput>;
  onConflict?: InputMaybe<ChatMessagesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatMessagesOneArgs = {
  object: ChatMessagesInsertInput;
  onConflict?: InputMaybe<ChatMessagesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatThreadsArgs = {
  objects: Array<ChatThreadsInsertInput>;
  onConflict?: InputMaybe<ChatThreadsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertChatThreadsOneArgs = {
  object: ChatThreadsInsertInput;
  onConflict?: InputMaybe<ChatThreadsOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRecipeNotesArgs = {
  objects: Array<RecipeNotesInsertInput>;
  onConflict?: InputMaybe<RecipeNotesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRecipeNotesOneArgs = {
  object: RecipeNotesInsertInput;
  onConflict?: InputMaybe<RecipeNotesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRecipesArgs = {
  objects: Array<RecipesInsertInput>;
  onConflict?: InputMaybe<RecipesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertRecipesOneArgs = {
  object: RecipesInsertInput;
  onConflict?: InputMaybe<RecipesOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersArgs = {
  objects: Array<UsersInsertInput>;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersOneArgs = {
  object: UsersInsertInput;
  onConflict?: InputMaybe<UsersOnConflict>;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntriesArgs = {
  _inc?: InputMaybe<BreadEntriesIncInput>;
  _set?: InputMaybe<BreadEntriesSetInput>;
  where: BreadEntriesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntriesByPkArgs = {
  _inc?: InputMaybe<BreadEntriesIncInput>;
  _set?: InputMaybe<BreadEntriesSetInput>;
  pkColumns: BreadEntriesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntriesManyArgs = {
  updates: Array<BreadEntriesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntryImagesArgs = {
  _inc?: InputMaybe<BreadEntryImagesIncInput>;
  _set?: InputMaybe<BreadEntryImagesSetInput>;
  where: BreadEntryImagesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntryImagesByPkArgs = {
  _inc?: InputMaybe<BreadEntryImagesIncInput>;
  _set?: InputMaybe<BreadEntryImagesSetInput>;
  pkColumns: BreadEntryImagesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateBreadEntryImagesManyArgs = {
  updates: Array<BreadEntryImagesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateChatMessageFilesArgs = {
  _inc?: InputMaybe<ChatMessageFilesIncInput>;
  _set?: InputMaybe<ChatMessageFilesSetInput>;
  where: ChatMessageFilesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateChatMessageFilesByPkArgs = {
  _inc?: InputMaybe<ChatMessageFilesIncInput>;
  _set?: InputMaybe<ChatMessageFilesSetInput>;
  pkColumns: ChatMessageFilesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateChatMessageFilesManyArgs = {
  updates: Array<ChatMessageFilesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateChatMessagesArgs = {
  _inc?: InputMaybe<ChatMessagesIncInput>;
  _set?: InputMaybe<ChatMessagesSetInput>;
  where: ChatMessagesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateChatMessagesByPkArgs = {
  _inc?: InputMaybe<ChatMessagesIncInput>;
  _set?: InputMaybe<ChatMessagesSetInput>;
  pkColumns: ChatMessagesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateChatMessagesManyArgs = {
  updates: Array<ChatMessagesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateChatThreadsArgs = {
  _set?: InputMaybe<ChatThreadsSetInput>;
  where: ChatThreadsBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateChatThreadsByPkArgs = {
  _set?: InputMaybe<ChatThreadsSetInput>;
  pkColumns: ChatThreadsPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateChatThreadsManyArgs = {
  updates: Array<ChatThreadsUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateRecipeNotesArgs = {
  _set?: InputMaybe<RecipeNotesSetInput>;
  where: RecipeNotesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateRecipeNotesByPkArgs = {
  _set?: InputMaybe<RecipeNotesSetInput>;
  pkColumns: RecipeNotesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateRecipeNotesManyArgs = {
  updates: Array<RecipeNotesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateRecipesArgs = {
  _set?: InputMaybe<RecipesSetInput>;
  where: RecipesBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateRecipesByPkArgs = {
  _set?: InputMaybe<RecipesSetInput>;
  pkColumns: RecipesPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateRecipesManyArgs = {
  updates: Array<RecipesUpdates>;
};


/** mutation root */
export type Mutation_RootUpdateUsersArgs = {
  _set?: InputMaybe<UsersSetInput>;
  where: UsersBoolExp;
};


/** mutation root */
export type Mutation_RootUpdateUsersByPkArgs = {
  _set?: InputMaybe<UsersSetInput>;
  pkColumns: UsersPkColumnsInput;
};


/** mutation root */
export type Mutation_RootUpdateUsersManyArgs = {
  updates: Array<UsersUpdates>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** An array relationship */
  breadEntries: Array<BreadEntries>;
  /** An aggregate relationship */
  breadEntriesAggregate: BreadEntriesAggregate;
  /** fetch data from the table: "bread_entries" using primary key columns */
  breadEntriesByPk?: Maybe<BreadEntries>;
  /** fetch data from the table: "bread_entry_images" */
  breadEntryImages: Array<BreadEntryImages>;
  /** fetch aggregated fields from the table: "bread_entry_images" */
  breadEntryImagesAggregate: BreadEntryImagesAggregate;
  /** fetch data from the table: "bread_entry_images" using primary key columns */
  breadEntryImagesByPk?: Maybe<BreadEntryImages>;
  /** fetch data from the table: "chat_message_files" */
  chatMessageFiles: Array<ChatMessageFiles>;
  /** fetch aggregated fields from the table: "chat_message_files" */
  chatMessageFilesAggregate: ChatMessageFilesAggregate;
  /** fetch data from the table: "chat_message_files" using primary key columns */
  chatMessageFilesByPk?: Maybe<ChatMessageFiles>;
  /** fetch data from the table: "chat_messages" */
  chatMessages: Array<ChatMessages>;
  /** fetch aggregated fields from the table: "chat_messages" */
  chatMessagesAggregate: ChatMessagesAggregate;
  /** fetch data from the table: "chat_messages" using primary key columns */
  chatMessagesByPk?: Maybe<ChatMessages>;
  /** fetch data from the table: "chat_threads" */
  chatThreads: Array<ChatThreads>;
  /** fetch aggregated fields from the table: "chat_threads" */
  chatThreadsAggregate: ChatThreadsAggregate;
  /** fetch data from the table: "chat_threads" using primary key columns */
  chatThreadsByPk?: Maybe<ChatThreads>;
  /** An array relationship */
  recipeNotes: Array<RecipeNotes>;
  /** An aggregate relationship */
  recipeNotesAggregate: RecipeNotesAggregate;
  /** fetch data from the table: "recipe_notes" using primary key columns */
  recipeNotesByPk?: Maybe<RecipeNotes>;
  /** An array relationship */
  recipes: Array<Recipes>;
  /** An aggregate relationship */
  recipesAggregate: RecipesAggregate;
  /** fetch data from the table: "recipes" using primary key columns */
  recipesByPk?: Maybe<Recipes>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  usersByPk?: Maybe<Users>;
};


export type Query_RootBreadEntriesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


export type Query_RootBreadEntriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


export type Query_RootBreadEntriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootBreadEntryImagesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


export type Query_RootBreadEntryImagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


export type Query_RootBreadEntryImagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootChatMessageFilesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


export type Query_RootChatMessageFilesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


export type Query_RootChatMessageFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootChatMessagesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


export type Query_RootChatMessagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


export type Query_RootChatMessagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootChatThreadsArgs = {
  distinctOn?: InputMaybe<Array<ChatThreadsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatThreadsOrderBy>>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};


export type Query_RootChatThreadsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatThreadsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatThreadsOrderBy>>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};


export type Query_RootChatThreadsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRecipeNotesArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


export type Query_RootRecipeNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


export type Query_RootRecipeNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRecipesArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};


export type Query_RootRecipesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};


export type Query_RootRecipesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Query_RootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Query_RootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};

export type RecipeNotesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RecipeNotesBoolExp>;
  predicate: IntComparisonExp;
};

export type RecipesAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RecipesSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
  filter?: InputMaybe<RecipesBoolExp>;
  predicate: IntComparisonExp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** An array relationship */
  breadEntries: Array<BreadEntries>;
  /** An aggregate relationship */
  breadEntriesAggregate: BreadEntriesAggregate;
  /** fetch data from the table: "bread_entries" using primary key columns */
  breadEntriesByPk?: Maybe<BreadEntries>;
  /** fetch data from the table in a streaming manner: "bread_entries" */
  breadEntriesStream: Array<BreadEntries>;
  /** fetch data from the table: "bread_entry_images" */
  breadEntryImages: Array<BreadEntryImages>;
  /** fetch aggregated fields from the table: "bread_entry_images" */
  breadEntryImagesAggregate: BreadEntryImagesAggregate;
  /** fetch data from the table: "bread_entry_images" using primary key columns */
  breadEntryImagesByPk?: Maybe<BreadEntryImages>;
  /** fetch data from the table in a streaming manner: "bread_entry_images" */
  breadEntryImagesStream: Array<BreadEntryImages>;
  /** fetch data from the table: "chat_message_files" */
  chatMessageFiles: Array<ChatMessageFiles>;
  /** fetch aggregated fields from the table: "chat_message_files" */
  chatMessageFilesAggregate: ChatMessageFilesAggregate;
  /** fetch data from the table: "chat_message_files" using primary key columns */
  chatMessageFilesByPk?: Maybe<ChatMessageFiles>;
  /** fetch data from the table in a streaming manner: "chat_message_files" */
  chatMessageFilesStream: Array<ChatMessageFiles>;
  /** fetch data from the table: "chat_messages" */
  chatMessages: Array<ChatMessages>;
  /** fetch aggregated fields from the table: "chat_messages" */
  chatMessagesAggregate: ChatMessagesAggregate;
  /** fetch data from the table: "chat_messages" using primary key columns */
  chatMessagesByPk?: Maybe<ChatMessages>;
  /** fetch data from the table in a streaming manner: "chat_messages" */
  chatMessagesStream: Array<ChatMessages>;
  /** fetch data from the table: "chat_threads" */
  chatThreads: Array<ChatThreads>;
  /** fetch aggregated fields from the table: "chat_threads" */
  chatThreadsAggregate: ChatThreadsAggregate;
  /** fetch data from the table: "chat_threads" using primary key columns */
  chatThreadsByPk?: Maybe<ChatThreads>;
  /** fetch data from the table in a streaming manner: "chat_threads" */
  chatThreadsStream: Array<ChatThreads>;
  /** An array relationship */
  recipeNotes: Array<RecipeNotes>;
  /** An aggregate relationship */
  recipeNotesAggregate: RecipeNotesAggregate;
  /** fetch data from the table: "recipe_notes" using primary key columns */
  recipeNotesByPk?: Maybe<RecipeNotes>;
  /** fetch data from the table in a streaming manner: "recipe_notes" */
  recipeNotesStream: Array<RecipeNotes>;
  /** An array relationship */
  recipes: Array<Recipes>;
  /** An aggregate relationship */
  recipesAggregate: RecipesAggregate;
  /** fetch data from the table: "recipes" using primary key columns */
  recipesByPk?: Maybe<Recipes>;
  /** fetch data from the table in a streaming manner: "recipes" */
  recipesStream: Array<Recipes>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  usersAggregate: UsersAggregate;
  /** fetch data from the table: "users" using primary key columns */
  usersByPk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  usersStream: Array<Users>;
};


export type Subscription_RootBreadEntriesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


export type Subscription_RootBreadEntriesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntriesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntriesOrderBy>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


export type Subscription_RootBreadEntriesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBreadEntriesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BreadEntriesStreamCursorInput>>;
  where?: InputMaybe<BreadEntriesBoolExp>;
};


export type Subscription_RootBreadEntryImagesArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


export type Subscription_RootBreadEntryImagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<BreadEntryImagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BreadEntryImagesOrderBy>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


export type Subscription_RootBreadEntryImagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBreadEntryImagesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<BreadEntryImagesStreamCursorInput>>;
  where?: InputMaybe<BreadEntryImagesBoolExp>;
};


export type Subscription_RootChatMessageFilesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


export type Subscription_RootChatMessageFilesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessageFilesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessageFilesOrderBy>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


export type Subscription_RootChatMessageFilesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootChatMessageFilesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ChatMessageFilesStreamCursorInput>>;
  where?: InputMaybe<ChatMessageFilesBoolExp>;
};


export type Subscription_RootChatMessagesArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


export type Subscription_RootChatMessagesAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatMessagesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatMessagesOrderBy>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


export type Subscription_RootChatMessagesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootChatMessagesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ChatMessagesStreamCursorInput>>;
  where?: InputMaybe<ChatMessagesBoolExp>;
};


export type Subscription_RootChatThreadsArgs = {
  distinctOn?: InputMaybe<Array<ChatThreadsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatThreadsOrderBy>>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};


export type Subscription_RootChatThreadsAggregateArgs = {
  distinctOn?: InputMaybe<Array<ChatThreadsSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChatThreadsOrderBy>>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};


export type Subscription_RootChatThreadsByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootChatThreadsStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<ChatThreadsStreamCursorInput>>;
  where?: InputMaybe<ChatThreadsBoolExp>;
};


export type Subscription_RootRecipeNotesArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


export type Subscription_RootRecipeNotesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipeNotesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipeNotesOrderBy>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


export type Subscription_RootRecipeNotesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRecipeNotesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RecipeNotesStreamCursorInput>>;
  where?: InputMaybe<RecipeNotesBoolExp>;
};


export type Subscription_RootRecipesArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};


export type Subscription_RootRecipesAggregateArgs = {
  distinctOn?: InputMaybe<Array<RecipesSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<RecipesOrderBy>>;
  where?: InputMaybe<RecipesBoolExp>;
};


export type Subscription_RootRecipesByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRecipesStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<RecipesStreamCursorInput>>;
  where?: InputMaybe<RecipesBoolExp>;
};


export type Subscription_RootUsersArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Subscription_RootUsersAggregateArgs = {
  distinctOn?: InputMaybe<Array<UsersSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  where?: InputMaybe<UsersBoolExp>;
};


export type Subscription_RootUsersByPkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUsersStreamArgs = {
  batchSize: Scalars['Int']['input'];
  cursor: Array<InputMaybe<UsersStreamCursorInput>>;
  where?: InputMaybe<UsersBoolExp>;
};

export type ChatThreadFragment = { __typename?: 'ChatThreads', id: any, title: string, messages: Array<{ __typename?: 'ChatMessages', id: any, content: string, role: string, user?: { __typename?: 'Users', id: any, name: string } | null, files: Array<{ __typename?: 'ChatMessageFiles', id: any, filePath: string, fileName: string, mimeType: string }> }>, breadEntry?: { __typename?: 'BreadEntries', archivedAt?: any | null, cons: string, consConfidence: any, createdAt: any, analysis: string, expertGuidance: string, expertGuidanceConfidence: any, id: any, notes: string, overallConfidence: any, overallScore: any, pros: string, prosConfidence: any, updatedAt: any, summary: string, trendAnalysis?: string | null, hasValidImage: boolean, validImageConfidence: any, recipeId?: any | null, recipe?: { __typename?: 'Recipes', id: any, name: string, url: string, ingredients: string, instructions: string, remarks: string, notes: Array<{ __typename?: 'RecipeNotes', id: any, content: string, createdAt: any }> } | null, images: Array<{ __typename?: 'BreadEntryImages', id: any, imagePath: string, imageName: string, originalImageName: string }> } | null };

export type InsertRecipeMutationVariables = Exact<{
  ingredients?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['uuid']['input'];
  flour?: InputMaybe<Scalars['String']['input']>;
  water?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
}>;


export type InsertRecipeMutation = { __typename?: 'mutation_root', insertRecipesOne?: { __typename?: 'Recipes', id: any, ingredients: string, instructions: string, lastUsedAt: any, name: string, remarks: string, url: string, flour: string, water: string, salt: string } | null };

export type InsertRecipeNoteMutationVariables = Exact<{
  content: Scalars['String']['input'];
  recipeId: Scalars['uuid']['input'];
  userId: Scalars['uuid']['input'];
}>;


export type InsertRecipeNoteMutation = { __typename?: 'mutation_root', insertRecipeNotesOne?: { __typename?: 'RecipeNotes', id: any, createdAt: any, content: string } | null };

export type SetBreadEntryRecipeMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  recipeId: Scalars['uuid']['input'];
}>;


export type SetBreadEntryRecipeMutation = { __typename?: 'mutation_root', updateBreadEntriesByPk?: { __typename?: 'BreadEntries', id: any, userId: any, recipeId?: any | null, recipe?: { __typename?: 'Recipes', ingredients: string, id: any, createdAt: any, name: string, instructions: string, url: string, remarks: string } | null } | null, updateRecipesByPk?: { __typename?: 'Recipes', id: any, lastUsedAt: any } | null };

export type SetUserFullNameMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type SetUserFullNameMutation = { __typename?: 'mutation_root', updateUsersByPk?: { __typename?: 'Users', id: any, name: string } | null };

export type UpdateBreadEntryNotesMutationVariables = Exact<{
  id?: InputMaybe<Scalars['uuid']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateBreadEntryNotesMutation = { __typename?: 'mutation_root', updateBreadEntriesByPk?: { __typename?: 'BreadEntries', id: any, notes: string } | null };

export type UpdateRecipeMutationVariables = Exact<{
  id: Scalars['uuid']['input'];
  ingredients?: InputMaybe<Scalars['String']['input']>;
  instructions?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  flour?: InputMaybe<Scalars['String']['input']>;
  water?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateRecipeMutation = { __typename?: 'mutation_root', updateRecipesByPk?: { __typename?: 'Recipes', id: any, ingredients: string, instructions: string, lastUsedAt: any, name: string, remarks: string, updatedAt: any, url: string, userId?: any | null, createdAt: any, deletedAt?: any | null, archivedAt?: any | null, flour: string, water: string, salt: string } | null };

export type GetBreadEntryByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetBreadEntryByIdQuery = { __typename?: 'query_root', breadEntriesByPk?: { __typename?: 'BreadEntries', archivedAt?: any | null, cons: string, consConfidence: any, createdAt: any, analysis: string, expertGuidance: string, expertGuidanceConfidence: any, id: any, notes: string, overallConfidence: any, overallScore: any, pros: string, prosConfidence: any, updatedAt: any, summary: string, trendAnalysis?: string | null, hasValidImage: boolean, validImageConfidence: any, recipeId?: any | null, recipe?: { __typename?: 'Recipes', id: any, name: string, url: string, ingredients: string, instructions: string, remarks: string, notes: Array<{ __typename?: 'RecipeNotes', id: any, content: string, createdAt: any }> } | null, images: Array<{ __typename?: 'BreadEntryImages', id: any, imagePath: string, imageName: string, originalImageName: string }> } | null };

export type GetChatThreadByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetChatThreadByIdQuery = { __typename?: 'query_root', chatThreadsByPk?: { __typename?: 'ChatThreads', id: any, title: string, messages: Array<{ __typename?: 'ChatMessages', id: any, content: string, role: string, user?: { __typename?: 'Users', id: any, name: string } | null, files: Array<{ __typename?: 'ChatMessageFiles', id: any, filePath: string, fileName: string, mimeType: string }> }>, breadEntry?: { __typename?: 'BreadEntries', archivedAt?: any | null, cons: string, consConfidence: any, createdAt: any, analysis: string, expertGuidance: string, expertGuidanceConfidence: any, id: any, notes: string, overallConfidence: any, overallScore: any, pros: string, prosConfidence: any, updatedAt: any, summary: string, trendAnalysis?: string | null, hasValidImage: boolean, validImageConfidence: any, recipeId?: any | null, recipe?: { __typename?: 'Recipes', id: any, name: string, url: string, ingredients: string, instructions: string, remarks: string, notes: Array<{ __typename?: 'RecipeNotes', id: any, content: string, createdAt: any }> } | null, images: Array<{ __typename?: 'BreadEntryImages', id: any, imagePath: string, imageName: string, originalImageName: string }> } | null } | null };

export type GetChatThreadsForUserQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetChatThreadsForUserQuery = { __typename?: 'query_root', chatThreads: Array<{ __typename?: 'ChatThreads', id: any, title: string }> };

export type GetRecipeBreadEntriesQueryVariables = Exact<{
  recipeId: Scalars['uuid']['input'];
}>;


export type GetRecipeBreadEntriesQuery = { __typename?: 'query_root', breadEntries: Array<{ __typename?: 'BreadEntries', archivedAt?: any | null, cons: string, consConfidence: any, createdAt: any, analysis: string, expertGuidance: string, expertGuidanceConfidence: any, id: any, notes: string, overallConfidence: any, overallScore: any, pros: string, prosConfidence: any, updatedAt: any, summary: string, trendAnalysis?: string | null, hasValidImage: boolean, validImageConfidence: any, images: Array<{ __typename?: 'BreadEntryImages', id: any, imagePath: string, imageName: string, originalImageName: string }> }> };

export type GetRecipeByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetRecipeByIdQuery = { __typename?: 'query_root', recipesByPk?: { __typename?: 'Recipes', archivedAt?: any | null, createdAt: any, deletedAt?: any | null, id: any, ingredients: string, instructions: string, lastUsedAt: any, name: string, remarks: string, updatedAt: any, url: string, flour: string, water: string, salt: string } | null };

export type GetRecipeNotesQueryVariables = Exact<{
  recipeId: Scalars['uuid']['input'];
}>;


export type GetRecipeNotesQuery = { __typename?: 'query_root', recipeNotes: Array<{ __typename?: 'RecipeNotes', id: any, createdAt: any, content: string }> };

export type GetUserBreadEntriesQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetUserBreadEntriesQuery = { __typename?: 'query_root', breadEntries: Array<{ __typename?: 'BreadEntries', archivedAt?: any | null, cons: string, consConfidence: any, createdAt: any, analysis: string, expertGuidance: string, expertGuidanceConfidence: any, id: any, notes: string, overallConfidence: any, overallScore: any, pros: string, prosConfidence: any, updatedAt: any, summary: string, trendAnalysis?: string | null, hasValidImage: boolean, validImageConfidence: any, recipe?: { __typename?: 'Recipes', id: any, name: string, url: string } | null, images: Array<{ __typename?: 'BreadEntryImages', id: any, imagePath: string, imageName: string, originalImageName: string }> }> };

export type GetUserRecipesQueryVariables = Exact<{
  userId: Scalars['uuid']['input'];
}>;


export type GetUserRecipesQuery = { __typename?: 'query_root', recipes: Array<{ __typename?: 'Recipes', id: any, name: string, remarks: string, url: string, flour: string, water: string, salt: string, lastUsedAt: any }> };

export type GetViewerByIdQueryVariables = Exact<{
  id: Scalars['uuid']['input'];
}>;


export type GetViewerByIdQuery = { __typename?: 'query_root', usersByPk?: { __typename?: 'Users', id: any, name: string, email: string } | null };

export const ChatThreadFragmentDoc = gql`
    fragment chatThread on ChatThreads {
  id
  title
  messages(orderBy: {createdAt: ASC}) {
    id
    user {
      id
      name
    }
    content
    role
    files {
      id
      filePath
      fileName
      mimeType
    }
  }
  breadEntry {
    archivedAt
    cons
    consConfidence
    createdAt
    analysis
    expertGuidance
    expertGuidanceConfidence
    id
    notes
    overallConfidence
    overallScore
    pros
    prosConfidence
    updatedAt
    summary
    trendAnalysis
    hasValidImage
    validImageConfidence
    recipeId
    recipe {
      id
      name
      url
      ingredients
      instructions
      remarks
      notes(
        orderBy: {createdAt: DESC}
        where: {archivedAt: {_isNull: true}, deletedAt: {_isNull: true}}
      ) {
        id
        content
        createdAt
      }
    }
    images(orderBy: {createdAt: DESC}) {
      id
      imagePath
      imageName
      originalImageName
    }
  }
}
    `;
export const InsertRecipeDocument = gql`
    mutation insertRecipe($ingredients: String = "", $instructions: String = "", $name: String = "", $remarks: String = "", $url: String = "", $userId: uuid!, $flour: String = "", $water: String = "", $salt: String = "") {
  insertRecipesOne(
    object: {ingredients: $ingredients, instructions: $instructions, name: $name, remarks: $remarks, url: $url, userId: $userId, flour: $flour, water: $water, salt: $salt}
  ) {
    id
    ingredients
    instructions
    lastUsedAt
    name
    remarks
    url
    flour
    water
    salt
  }
}
    `;
export type InsertRecipeMutationFn = Apollo.MutationFunction<InsertRecipeMutation, InsertRecipeMutationVariables>;

/**
 * __useInsertRecipeMutation__
 *
 * To run a mutation, you first call `useInsertRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertRecipeMutation, { data, loading, error }] = useInsertRecipeMutation({
 *   variables: {
 *      ingredients: // value for 'ingredients'
 *      instructions: // value for 'instructions'
 *      name: // value for 'name'
 *      remarks: // value for 'remarks'
 *      url: // value for 'url'
 *      userId: // value for 'userId'
 *      flour: // value for 'flour'
 *      water: // value for 'water'
 *      salt: // value for 'salt'
 *   },
 * });
 */
export function useInsertRecipeMutation(baseOptions?: Apollo.MutationHookOptions<InsertRecipeMutation, InsertRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertRecipeMutation, InsertRecipeMutationVariables>(InsertRecipeDocument, options);
      }
export type InsertRecipeMutationHookResult = ReturnType<typeof useInsertRecipeMutation>;
export type InsertRecipeMutationResult = Apollo.MutationResult<InsertRecipeMutation>;
export type InsertRecipeMutationOptions = Apollo.BaseMutationOptions<InsertRecipeMutation, InsertRecipeMutationVariables>;
export const InsertRecipeNoteDocument = gql`
    mutation insertRecipeNote($content: String!, $recipeId: uuid!, $userId: uuid!) {
  insertRecipeNotesOne(
    object: {content: $content, recipeId: $recipeId, userId: $userId}
  ) {
    id
    createdAt
    content
  }
}
    `;
export type InsertRecipeNoteMutationFn = Apollo.MutationFunction<InsertRecipeNoteMutation, InsertRecipeNoteMutationVariables>;

/**
 * __useInsertRecipeNoteMutation__
 *
 * To run a mutation, you first call `useInsertRecipeNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertRecipeNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertRecipeNoteMutation, { data, loading, error }] = useInsertRecipeNoteMutation({
 *   variables: {
 *      content: // value for 'content'
 *      recipeId: // value for 'recipeId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInsertRecipeNoteMutation(baseOptions?: Apollo.MutationHookOptions<InsertRecipeNoteMutation, InsertRecipeNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertRecipeNoteMutation, InsertRecipeNoteMutationVariables>(InsertRecipeNoteDocument, options);
      }
export type InsertRecipeNoteMutationHookResult = ReturnType<typeof useInsertRecipeNoteMutation>;
export type InsertRecipeNoteMutationResult = Apollo.MutationResult<InsertRecipeNoteMutation>;
export type InsertRecipeNoteMutationOptions = Apollo.BaseMutationOptions<InsertRecipeNoteMutation, InsertRecipeNoteMutationVariables>;
export const SetBreadEntryRecipeDocument = gql`
    mutation setBreadEntryRecipe($id: uuid!, $recipeId: uuid!) {
  updateBreadEntriesByPk(pkColumns: {id: $id}, _set: {recipeId: $recipeId}) {
    id
    userId
    recipeId
    recipe {
      ingredients
      id
      createdAt
      name
      instructions
      url
      remarks
    }
  }
  updateRecipesByPk(pkColumns: {id: $recipeId}, _set: {lastUsedAt: "now()"}) {
    id
    lastUsedAt
  }
}
    `;
export type SetBreadEntryRecipeMutationFn = Apollo.MutationFunction<SetBreadEntryRecipeMutation, SetBreadEntryRecipeMutationVariables>;

/**
 * __useSetBreadEntryRecipeMutation__
 *
 * To run a mutation, you first call `useSetBreadEntryRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetBreadEntryRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setBreadEntryRecipeMutation, { data, loading, error }] = useSetBreadEntryRecipeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useSetBreadEntryRecipeMutation(baseOptions?: Apollo.MutationHookOptions<SetBreadEntryRecipeMutation, SetBreadEntryRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetBreadEntryRecipeMutation, SetBreadEntryRecipeMutationVariables>(SetBreadEntryRecipeDocument, options);
      }
export type SetBreadEntryRecipeMutationHookResult = ReturnType<typeof useSetBreadEntryRecipeMutation>;
export type SetBreadEntryRecipeMutationResult = Apollo.MutationResult<SetBreadEntryRecipeMutation>;
export type SetBreadEntryRecipeMutationOptions = Apollo.BaseMutationOptions<SetBreadEntryRecipeMutation, SetBreadEntryRecipeMutationVariables>;
export const SetUserFullNameDocument = gql`
    mutation setUserFullName($id: uuid!, $name: String = "") {
  updateUsersByPk(pkColumns: {id: $id}, _set: {name: $name}) {
    id
    name
  }
}
    `;
export type SetUserFullNameMutationFn = Apollo.MutationFunction<SetUserFullNameMutation, SetUserFullNameMutationVariables>;

/**
 * __useSetUserFullNameMutation__
 *
 * To run a mutation, you first call `useSetUserFullNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUserFullNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUserFullNameMutation, { data, loading, error }] = useSetUserFullNameMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSetUserFullNameMutation(baseOptions?: Apollo.MutationHookOptions<SetUserFullNameMutation, SetUserFullNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetUserFullNameMutation, SetUserFullNameMutationVariables>(SetUserFullNameDocument, options);
      }
export type SetUserFullNameMutationHookResult = ReturnType<typeof useSetUserFullNameMutation>;
export type SetUserFullNameMutationResult = Apollo.MutationResult<SetUserFullNameMutation>;
export type SetUserFullNameMutationOptions = Apollo.BaseMutationOptions<SetUserFullNameMutation, SetUserFullNameMutationVariables>;
export const UpdateBreadEntryNotesDocument = gql`
    mutation updateBreadEntryNotes($id: uuid = "", $notes: String = "") {
  updateBreadEntriesByPk(pkColumns: {id: $id}, _set: {notes: $notes}) {
    id
    notes
  }
}
    `;
export type UpdateBreadEntryNotesMutationFn = Apollo.MutationFunction<UpdateBreadEntryNotesMutation, UpdateBreadEntryNotesMutationVariables>;

/**
 * __useUpdateBreadEntryNotesMutation__
 *
 * To run a mutation, you first call `useUpdateBreadEntryNotesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBreadEntryNotesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBreadEntryNotesMutation, { data, loading, error }] = useUpdateBreadEntryNotesMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notes: // value for 'notes'
 *   },
 * });
 */
export function useUpdateBreadEntryNotesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBreadEntryNotesMutation, UpdateBreadEntryNotesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBreadEntryNotesMutation, UpdateBreadEntryNotesMutationVariables>(UpdateBreadEntryNotesDocument, options);
      }
export type UpdateBreadEntryNotesMutationHookResult = ReturnType<typeof useUpdateBreadEntryNotesMutation>;
export type UpdateBreadEntryNotesMutationResult = Apollo.MutationResult<UpdateBreadEntryNotesMutation>;
export type UpdateBreadEntryNotesMutationOptions = Apollo.BaseMutationOptions<UpdateBreadEntryNotesMutation, UpdateBreadEntryNotesMutationVariables>;
export const UpdateRecipeDocument = gql`
    mutation updateRecipe($id: uuid!, $ingredients: String, $instructions: String, $name: String, $remarks: String, $url: String, $flour: String, $water: String, $salt: String) {
  updateRecipesByPk(
    pkColumns: {id: $id}
    _set: {ingredients: $ingredients, instructions: $instructions, name: $name, remarks: $remarks, url: $url, flour: $flour, water: $water, salt: $salt}
  ) {
    id
    ingredients
    instructions
    lastUsedAt
    name
    remarks
    updatedAt
    url
    userId
    createdAt
    deletedAt
    archivedAt
    flour
    water
    salt
  }
}
    `;
export type UpdateRecipeMutationFn = Apollo.MutationFunction<UpdateRecipeMutation, UpdateRecipeMutationVariables>;

/**
 * __useUpdateRecipeMutation__
 *
 * To run a mutation, you first call `useUpdateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRecipeMutation, { data, loading, error }] = useUpdateRecipeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      ingredients: // value for 'ingredients'
 *      instructions: // value for 'instructions'
 *      name: // value for 'name'
 *      remarks: // value for 'remarks'
 *      url: // value for 'url'
 *      flour: // value for 'flour'
 *      water: // value for 'water'
 *      salt: // value for 'salt'
 *   },
 * });
 */
export function useUpdateRecipeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRecipeMutation, UpdateRecipeMutationVariables>(UpdateRecipeDocument, options);
      }
export type UpdateRecipeMutationHookResult = ReturnType<typeof useUpdateRecipeMutation>;
export type UpdateRecipeMutationResult = Apollo.MutationResult<UpdateRecipeMutation>;
export type UpdateRecipeMutationOptions = Apollo.BaseMutationOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>;
export const GetBreadEntryByIdDocument = gql`
    query getBreadEntryById($id: uuid!) {
  breadEntriesByPk(id: $id) {
    archivedAt
    cons
    consConfidence
    createdAt
    analysis
    expertGuidance
    expertGuidanceConfidence
    id
    notes
    overallConfidence
    overallScore
    pros
    prosConfidence
    updatedAt
    summary
    trendAnalysis
    hasValidImage
    validImageConfidence
    recipeId
    recipe {
      id
      name
      url
      ingredients
      instructions
      remarks
      notes(
        orderBy: {createdAt: DESC}
        where: {archivedAt: {_isNull: true}, deletedAt: {_isNull: true}}
      ) {
        id
        content
        createdAt
      }
    }
    images(orderBy: {createdAt: DESC}) {
      id
      imagePath
      imageName
      originalImageName
    }
  }
}
    `;

/**
 * __useGetBreadEntryByIdQuery__
 *
 * To run a query within a React component, call `useGetBreadEntryByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBreadEntryByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBreadEntryByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBreadEntryByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables> & ({ variables: GetBreadEntryByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>(GetBreadEntryByIdDocument, options);
      }
export function useGetBreadEntryByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>(GetBreadEntryByIdDocument, options);
        }
export function useGetBreadEntryByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>(GetBreadEntryByIdDocument, options);
        }
export type GetBreadEntryByIdQueryHookResult = ReturnType<typeof useGetBreadEntryByIdQuery>;
export type GetBreadEntryByIdLazyQueryHookResult = ReturnType<typeof useGetBreadEntryByIdLazyQuery>;
export type GetBreadEntryByIdSuspenseQueryHookResult = ReturnType<typeof useGetBreadEntryByIdSuspenseQuery>;
export type GetBreadEntryByIdQueryResult = Apollo.QueryResult<GetBreadEntryByIdQuery, GetBreadEntryByIdQueryVariables>;
export const GetChatThreadByIdDocument = gql`
    query getChatThreadById($id: uuid!) {
  chatThreadsByPk(id: $id) {
    ...chatThread
  }
}
    ${ChatThreadFragmentDoc}`;

/**
 * __useGetChatThreadByIdQuery__
 *
 * To run a query within a React component, call `useGetChatThreadByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatThreadByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatThreadByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetChatThreadByIdQuery(baseOptions: Apollo.QueryHookOptions<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables> & ({ variables: GetChatThreadByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>(GetChatThreadByIdDocument, options);
      }
export function useGetChatThreadByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>(GetChatThreadByIdDocument, options);
        }
export function useGetChatThreadByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>(GetChatThreadByIdDocument, options);
        }
export type GetChatThreadByIdQueryHookResult = ReturnType<typeof useGetChatThreadByIdQuery>;
export type GetChatThreadByIdLazyQueryHookResult = ReturnType<typeof useGetChatThreadByIdLazyQuery>;
export type GetChatThreadByIdSuspenseQueryHookResult = ReturnType<typeof useGetChatThreadByIdSuspenseQuery>;
export type GetChatThreadByIdQueryResult = Apollo.QueryResult<GetChatThreadByIdQuery, GetChatThreadByIdQueryVariables>;
export const GetChatThreadsForUserDocument = gql`
    query getChatThreadsForUser($userId: uuid!) {
  chatThreads(where: {userId: {_eq: $userId}}, orderBy: {updatedAt: DESC}) {
    id
    title
  }
}
    `;

/**
 * __useGetChatThreadsForUserQuery__
 *
 * To run a query within a React component, call `useGetChatThreadsForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatThreadsForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatThreadsForUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetChatThreadsForUserQuery(baseOptions: Apollo.QueryHookOptions<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables> & ({ variables: GetChatThreadsForUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>(GetChatThreadsForUserDocument, options);
      }
export function useGetChatThreadsForUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>(GetChatThreadsForUserDocument, options);
        }
export function useGetChatThreadsForUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>(GetChatThreadsForUserDocument, options);
        }
export type GetChatThreadsForUserQueryHookResult = ReturnType<typeof useGetChatThreadsForUserQuery>;
export type GetChatThreadsForUserLazyQueryHookResult = ReturnType<typeof useGetChatThreadsForUserLazyQuery>;
export type GetChatThreadsForUserSuspenseQueryHookResult = ReturnType<typeof useGetChatThreadsForUserSuspenseQuery>;
export type GetChatThreadsForUserQueryResult = Apollo.QueryResult<GetChatThreadsForUserQuery, GetChatThreadsForUserQueryVariables>;
export const GetRecipeBreadEntriesDocument = gql`
    query getRecipeBreadEntries($recipeId: uuid!) {
  breadEntries(
    orderBy: {createdAt: DESC}
    where: {recipeId: {_eq: $recipeId}, archivedAt: {_isNull: true}, deletedAt: {_isNull: true}}
  ) {
    archivedAt
    cons
    consConfidence
    createdAt
    analysis
    expertGuidance
    expertGuidanceConfidence
    id
    notes
    overallConfidence
    overallScore
    pros
    prosConfidence
    updatedAt
    summary
    trendAnalysis
    hasValidImage
    validImageConfidence
    images(orderBy: {createdAt: DESC}) {
      id
      imagePath
      imageName
      originalImageName
    }
  }
}
    `;

/**
 * __useGetRecipeBreadEntriesQuery__
 *
 * To run a query within a React component, call `useGetRecipeBreadEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecipeBreadEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecipeBreadEntriesQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useGetRecipeBreadEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables> & ({ variables: GetRecipeBreadEntriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>(GetRecipeBreadEntriesDocument, options);
      }
export function useGetRecipeBreadEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>(GetRecipeBreadEntriesDocument, options);
        }
export function useGetRecipeBreadEntriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>(GetRecipeBreadEntriesDocument, options);
        }
export type GetRecipeBreadEntriesQueryHookResult = ReturnType<typeof useGetRecipeBreadEntriesQuery>;
export type GetRecipeBreadEntriesLazyQueryHookResult = ReturnType<typeof useGetRecipeBreadEntriesLazyQuery>;
export type GetRecipeBreadEntriesSuspenseQueryHookResult = ReturnType<typeof useGetRecipeBreadEntriesSuspenseQuery>;
export type GetRecipeBreadEntriesQueryResult = Apollo.QueryResult<GetRecipeBreadEntriesQuery, GetRecipeBreadEntriesQueryVariables>;
export const GetRecipeByIdDocument = gql`
    query getRecipeById($id: uuid!) {
  recipesByPk(id: $id) {
    archivedAt
    createdAt
    deletedAt
    id
    ingredients
    instructions
    lastUsedAt
    name
    remarks
    updatedAt
    url
    flour
    water
    salt
  }
}
    `;

/**
 * __useGetRecipeByIdQuery__
 *
 * To run a query within a React component, call `useGetRecipeByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecipeByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecipeByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRecipeByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRecipeByIdQuery, GetRecipeByIdQueryVariables> & ({ variables: GetRecipeByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>(GetRecipeByIdDocument, options);
      }
export function useGetRecipeByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>(GetRecipeByIdDocument, options);
        }
export function useGetRecipeByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>(GetRecipeByIdDocument, options);
        }
export type GetRecipeByIdQueryHookResult = ReturnType<typeof useGetRecipeByIdQuery>;
export type GetRecipeByIdLazyQueryHookResult = ReturnType<typeof useGetRecipeByIdLazyQuery>;
export type GetRecipeByIdSuspenseQueryHookResult = ReturnType<typeof useGetRecipeByIdSuspenseQuery>;
export type GetRecipeByIdQueryResult = Apollo.QueryResult<GetRecipeByIdQuery, GetRecipeByIdQueryVariables>;
export const GetRecipeNotesDocument = gql`
    query getRecipeNotes($recipeId: uuid!) {
  recipeNotes(
    orderBy: {createdAt: DESC}
    where: {recipeId: {_eq: $recipeId}, deletedAt: {_isNull: true}, archivedAt: {_isNull: true}}
  ) {
    id
    createdAt
    content
  }
}
    `;

/**
 * __useGetRecipeNotesQuery__
 *
 * To run a query within a React component, call `useGetRecipeNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecipeNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecipeNotesQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useGetRecipeNotesQuery(baseOptions: Apollo.QueryHookOptions<GetRecipeNotesQuery, GetRecipeNotesQueryVariables> & ({ variables: GetRecipeNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>(GetRecipeNotesDocument, options);
      }
export function useGetRecipeNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>(GetRecipeNotesDocument, options);
        }
export function useGetRecipeNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>(GetRecipeNotesDocument, options);
        }
export type GetRecipeNotesQueryHookResult = ReturnType<typeof useGetRecipeNotesQuery>;
export type GetRecipeNotesLazyQueryHookResult = ReturnType<typeof useGetRecipeNotesLazyQuery>;
export type GetRecipeNotesSuspenseQueryHookResult = ReturnType<typeof useGetRecipeNotesSuspenseQuery>;
export type GetRecipeNotesQueryResult = Apollo.QueryResult<GetRecipeNotesQuery, GetRecipeNotesQueryVariables>;
export const GetUserBreadEntriesDocument = gql`
    query getUserBreadEntries($userId: uuid!) {
  breadEntries(orderBy: {createdAt: DESC}, where: {userId: {_eq: $userId}}) {
    archivedAt
    cons
    consConfidence
    createdAt
    analysis
    expertGuidance
    expertGuidanceConfidence
    id
    notes
    overallConfidence
    overallScore
    pros
    prosConfidence
    updatedAt
    summary
    trendAnalysis
    recipe {
      id
      name
      url
    }
    hasValidImage
    validImageConfidence
    images(orderBy: {createdAt: DESC}) {
      id
      imagePath
      imageName
      originalImageName
    }
  }
}
    `;

/**
 * __useGetUserBreadEntriesQuery__
 *
 * To run a query within a React component, call `useGetUserBreadEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserBreadEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserBreadEntriesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserBreadEntriesQuery(baseOptions: Apollo.QueryHookOptions<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables> & ({ variables: GetUserBreadEntriesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>(GetUserBreadEntriesDocument, options);
      }
export function useGetUserBreadEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>(GetUserBreadEntriesDocument, options);
        }
export function useGetUserBreadEntriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>(GetUserBreadEntriesDocument, options);
        }
export type GetUserBreadEntriesQueryHookResult = ReturnType<typeof useGetUserBreadEntriesQuery>;
export type GetUserBreadEntriesLazyQueryHookResult = ReturnType<typeof useGetUserBreadEntriesLazyQuery>;
export type GetUserBreadEntriesSuspenseQueryHookResult = ReturnType<typeof useGetUserBreadEntriesSuspenseQuery>;
export type GetUserBreadEntriesQueryResult = Apollo.QueryResult<GetUserBreadEntriesQuery, GetUserBreadEntriesQueryVariables>;
export const GetUserRecipesDocument = gql`
    query getUserRecipes($userId: uuid!) {
  recipes(orderBy: {lastUsedAt: DESC}, where: {userId: {_eq: $userId}}) {
    id
    name
    remarks
    url
    flour
    water
    salt
    lastUsedAt
  }
}
    `;

/**
 * __useGetUserRecipesQuery__
 *
 * To run a query within a React component, call `useGetUserRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserRecipesQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserRecipesQuery(baseOptions: Apollo.QueryHookOptions<GetUserRecipesQuery, GetUserRecipesQueryVariables> & ({ variables: GetUserRecipesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserRecipesQuery, GetUserRecipesQueryVariables>(GetUserRecipesDocument, options);
      }
export function useGetUserRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserRecipesQuery, GetUserRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserRecipesQuery, GetUserRecipesQueryVariables>(GetUserRecipesDocument, options);
        }
export function useGetUserRecipesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserRecipesQuery, GetUserRecipesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserRecipesQuery, GetUserRecipesQueryVariables>(GetUserRecipesDocument, options);
        }
export type GetUserRecipesQueryHookResult = ReturnType<typeof useGetUserRecipesQuery>;
export type GetUserRecipesLazyQueryHookResult = ReturnType<typeof useGetUserRecipesLazyQuery>;
export type GetUserRecipesSuspenseQueryHookResult = ReturnType<typeof useGetUserRecipesSuspenseQuery>;
export type GetUserRecipesQueryResult = Apollo.QueryResult<GetUserRecipesQuery, GetUserRecipesQueryVariables>;
export const GetViewerByIdDocument = gql`
    query getViewerById($id: uuid!) {
  usersByPk(id: $id) {
    id
    name
    email
  }
}
    `;

/**
 * __useGetViewerByIdQuery__
 *
 * To run a query within a React component, call `useGetViewerByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetViewerByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetViewerByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetViewerByIdQuery(baseOptions: Apollo.QueryHookOptions<GetViewerByIdQuery, GetViewerByIdQueryVariables> & ({ variables: GetViewerByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetViewerByIdQuery, GetViewerByIdQueryVariables>(GetViewerByIdDocument, options);
      }
export function useGetViewerByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetViewerByIdQuery, GetViewerByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetViewerByIdQuery, GetViewerByIdQueryVariables>(GetViewerByIdDocument, options);
        }
export function useGetViewerByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetViewerByIdQuery, GetViewerByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetViewerByIdQuery, GetViewerByIdQueryVariables>(GetViewerByIdDocument, options);
        }
export type GetViewerByIdQueryHookResult = ReturnType<typeof useGetViewerByIdQuery>;
export type GetViewerByIdLazyQueryHookResult = ReturnType<typeof useGetViewerByIdLazyQuery>;
export type GetViewerByIdSuspenseQueryHookResult = ReturnType<typeof useGetViewerByIdSuspenseQuery>;
export type GetViewerByIdQueryResult = Apollo.QueryResult<GetViewerByIdQuery, GetViewerByIdQueryVariables>;