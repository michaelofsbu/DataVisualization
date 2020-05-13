import pandas as pd 

# Sample data randomly
def randomSample(df, frac=0.01):
    return df.sample(frac=frac).reset_index(drop=True)

# Sample data stratifiedly
def stratifiedSample(df, frac = 0.01):
    df = df.groupby('License Type').apply(lambda x: x.sample(frac=frac))
    return df.reset_index(drop=True)

# Load data from url and process it
def read(url):
    df = pd.read_csv(url)
    df = df.drop(columns = ['Business Name 2', 'Address Building', 'Address Street Name', 
                            'Secondary Address Street Name', 'Contact Phone Number', 'Borough Code',
                            'Community Board', 'Council District', 'BIN', 'BBL', 'NTA', 'Census Tract',
                            'Detail', 'Longitude', 'Latitude', 'Location'])
    df = stratifiedSample(df)
    df = df.dropna(axis='index', how='any')
    df = df[df['Address State'] == 'NY']
    return df.reset_index(drop=True)

if __name__ == '__main__':
    url = 'https://raw.githubusercontent.com/michaelofsbu/cse564_finaldata/master/Legally_Operating_Businesses.csv'
    df = read(url)
    df.to_csv(r'./processed_data.csv', index=False)
    
