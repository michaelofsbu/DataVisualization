import pandas as pd
import random
import numpy as np

def count_frequency(df):
    cats = df.Industry.unique().tolist()
    items = pd.DataFrame(df['Industry'], columns=['Industry'])
    frequencies = pd.DataFrame(np.zeros(len(cats)), columns=['count'])
    frequencies = pd.concat([pd.DataFrame(cats, columns=['industry']), frequencies], axis=1)

    for c in cats:
        frequencies.loc[frequencies['industry'] == c, 'count'] = len(items[items['Industry'] == c])

    return frequencies

def get_map_info(df, argument):
    if argument == "all":
        businesses_by_zip = df
    else:
        businesses_by_zip = df.loc[df['Industry'] == argument]
    businesses_by_zip = businesses_by_zip[['Address_ZIP']]

    zips = businesses_by_zip.Address_ZIP.unique().tolist()
    frequencies = pd.DataFrame(np.zeros(len(zips)), columns=['count'])
    frequencies = pd.concat([pd.DataFrame(zips, columns=['zip']), frequencies], axis=1)

    for z in zips:
        frequencies.loc[frequencies['zip'] == z, 'count'] = len(businesses_by_zip[businesses_by_zip['Address_ZIP'] == z])
    sum = frequencies['count'].sum()
    #max = frequencies['count'].max()
    #divide = max/5
    frequencies['count'] = frequencies['count'] * 100 / sum
    return frequencies

# df = pd.read_csv("../processed_data.csv")
# print(get_map_info(df, 'Electronics Store')['count'].sum())
