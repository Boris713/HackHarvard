import json
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

DATA_FILE = 'data.json'

with open(DATA_FILE, 'r') as file:
    companies = json.load(file)
target_years = [2024, 2023, 2022, 2021, 2020]
def scores_data_to_dict(scores_data, years):
    return dict(zip(years, scores_data))

data_records = []
for company in companies:
    record = {
        'name': company['name'],
        'industry': company.get('industry', ''),
        'location': company.get('location', ''),
        'size': company.get('size', '')
    }
    # Expand scoresData into separate year columns
    scores_dict = scores_data_to_dict(company['scoresData'], target_years)
    for year in target_years:
        record[str(year)] = scores_dict.get(year, np.nan)
    data_records.append(record)

df = pd.DataFrame(data_records)
df.set_index('name', inplace=True)

# Display the DataFrame (optional)
print("Initial DataFrame:")
print(df.tail())

# Prepare the years as numerical values for regression
years_numeric = np.array([2020, 2021, 2022, 2023, 2024]).reshape(-1, 1)

# Initialize a dictionary to store predictions
predictions = {}

# Perform linear regression for each company to predict 2025 score
for company in df.index:
    # Extract the sustainability scores
    scores = df.loc[company, ['2020', '2021', '2022', '2023', '2024']].values.astype(float)
    
    # Check for missing values
    if np.isnan(scores).any():
        print(f"Warning: Missing scores for {company}. Skipping prediction.")
        predictions[company] = None
        continue
    
    # Reshape scores for regression
    X = years_numeric
    y = scores.reshape(-1, 1)
    
    # Create and fit the linear regression model
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict the score for 2025
    predicted_score = model.predict([[2025]])[0][0]
    predictions[company] = round(predicted_score, 2)  # Rounded to 2 decimal places

# Add the predicted scores to the DataFrame
df['Predicted_2025_Score'] = pd.Series(predictions)

# Display predictions (optional)
print("\nPredicted 2025 Scores:")
print(df['Predicted_2025_Score'].tail())

# Update the companies data with the predicted scores
for company in companies:
    name = company['name']
    predicted_score = df.at[name, 'Predicted_2025_Score']
    if not np.isnan(predicted_score):
        # Add the predicted score as a new field
        company['predicted_score_2025'] = predicted_score
    else:
        company['predicted_score_2025'] = None  # or handle as desired

# Save the updated data back to data.json
with open(DATA_FILE, 'w') as file:
    json.dump(companies, file, indent=4)

print(f"\nUpdated data with predicted 2025 scores has been saved to {DATA_FILE}.")
