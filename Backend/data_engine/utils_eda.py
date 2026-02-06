from pathlib import Path

import numpy as np
import pandas as pd

from .utils_cleaning import load_dataframe


def compute_correlation(df):
    numeric_df = df.select_dtypes(include='number')
    if numeric_df.empty:
        return {'columns': [], 'matrix': []}
    corr = numeric_df.corr().round(4)
    return {
        'columns': corr.columns.tolist(),
        'matrix': corr.values.tolist(),
    }


def compute_distributions(df, bins=10):
    distributions = {}
    numeric_df = df.select_dtypes(include='number')
    for column in numeric_df.columns:
        counts, bin_edges = np.histogram(numeric_df[column].dropna(), bins=bins)
        distributions[column] = {
            'bins': bin_edges.round(4).tolist(),
            'counts': counts.tolist(),
        }
    return distributions


def compute_summary_stats(df):
    numeric_df = df.select_dtypes(include='number')
    if numeric_df.empty:
        return {}
    summary = numeric_df.describe().round(4)
    return summary.to_dict()


def generate_eda(file_path):
    df = load_dataframe(Path(file_path))
    return {
        'correlation': compute_correlation(df),
        'distributions': compute_distributions(df),
        'summary_stats': compute_summary_stats(df),
    }
