# chen thu vien
import pandas as pd
import numpy as np
import os

# load DT
from sklearn import tree

# load dataset from csv file 
data = pd.read_csv('breast-cancer-wisconsin.data') 
data.head()

from sklearn import preprocessing
le = preprocessing.LabelEncoder()
for column_name in data.columns:
	if data[column_name].dtype == object:
		data[column_name] = le.fit_transform(data[column_name])
	else:
		pass

# tach nhan tap du lieu
y = data.iloc[:,-1]
X = data.iloc[:,1:10]

clf = tree.DecisionTreeClassifier(criterion="gini")
clf = clf.fit(X, y)

