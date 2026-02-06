from pathlib import Path

import pandas as pd


def load_dataframe(file_path):
    file_path = Path(file_path)
    if file_path.suffix.lower() in ['.xlsx', '.xls']:
        return pd.read_excel(file_path)
    return pd.read_csv(file_path)


def clean_dataframe(df):
    initial_rows = len(df)

    numeric_columns = df.select_dtypes(include='number').columns
    categorical_columns = df.select_dtypes(exclude='number').columns

    for column in numeric_columns:
        median_value = df[column].median()
        df[column] = df[column].fillna(median_value)

    for column in categorical_columns:
        mode_value = df[column].mode(dropna=True)
        fill_value = mode_value.iloc[0] if not mode_value.empty else 'Unknown'
        df[column] = df[column].fillna(fill_value)

    date_columns = [
        col for col in df.columns
        if 'date' in col.lower() or 'time' in col.lower()
    ]

    converted_dates = []
    for column in date_columns:
        df[column] = pd.to_datetime(df[column], errors='ignore')
        converted_dates.append(column)

    before_duplicates = len(df)
    df = df.drop_duplicates()
    after_duplicates = len(df)

    return df, {
        'rows_before': initial_rows,
        'rows_after': len(df),
        'rows_removed': before_duplicates - after_duplicates,
        'converted_date_columns': converted_dates,
    }


def save_cleaned_dataframe(df, original_file_path):
    original_path = Path(original_file_path)
    cleaned_filename = f'cleaned_{original_path.stem}.csv'
    cleaned_path = original_path.parent / cleaned_filename
    df.to_csv(cleaned_path, index=False)
    return cleaned_path


def clean_dataset(file_path):
    df = load_dataframe(file_path)
    cleaned_df, summary = clean_dataframe(df)
    cleaned_path = save_cleaned_dataframe(cleaned_df, file_path)
    return cleaned_path, summary
