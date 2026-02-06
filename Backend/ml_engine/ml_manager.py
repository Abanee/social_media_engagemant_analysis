from pathlib import Path

import joblib
import pandas as pd
from catboost import CatBoostClassifier
from lightgbm import LGBMRegressor
from sklearn.metrics import accuracy_score, f1_score, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from data_engine.utils_cleaning import load_dataframe


def _prepare_dataframe(file_path, target_column):
    df = load_dataframe(Path(file_path))
    if target_column not in df.columns:
        raise ValueError('Target column not found in dataset.')
    df = df.dropna(subset=[target_column])
    features = df.drop(columns=[target_column])
    features = pd.get_dummies(features)
    target = df[target_column]
    return features, target


def train_model(file_path, target_column, problem_type):
    features, target = _prepare_dataframe(file_path, target_column)
    X_train, X_test, y_train, y_test = train_test_split(
        features, target, test_size=0.2, random_state=42
    )

    if problem_type == 'regression':
        model = LGBMRegressor(random_state=42)
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        rmse = mean_squared_error(y_test, predictions, squared=False)
        r2 = r2_score(y_test, predictions)
        metrics = {'rmse': round(rmse, 4), 'r2': round(r2, 4)}
    elif problem_type == 'classification':
        model = CatBoostClassifier(verbose=False, random_state=42)
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        f1 = f1_score(y_test, predictions, average='weighted')
        metrics = {'accuracy': round(accuracy, 4), 'f1_score': round(f1, 4)}
    else:
        raise ValueError('Invalid problem type. Use regression or classification.')

    return model, metrics, features.columns.tolist()


def save_model(model, model_path):
    joblib.dump(model, model_path)


def load_model(model_path):
    return joblib.load(model_path)


def predict(model, feature_columns, features_payload):
    if isinstance(features_payload, dict):
        features_payload = [features_payload]
    df = pd.DataFrame(features_payload)
    df = pd.get_dummies(df)
    df = df.reindex(columns=feature_columns, fill_value=0)
    predictions = model.predict(df)
    return predictions.tolist()
