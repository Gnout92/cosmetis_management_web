# chen thu vien
import pandas as pd
import numpy as np
import os

# load DT
from sklearn import tree

# load dataset from csv file 
data = pd.read_csv('weather.csv')
data.head()

# chuyen kieu DL tu string/symbol sang numeric
from sklearn import preprocessing
le = preprocessing.LabelEncoder()
for column_name in data.columns:
	if data[column_name].dtype == object:
		data[column_name] = le.fit_transform(data[column_name])
	else:
		pass

# tach nhan tap du lieu
y = data['play']
X = data.iloc[:,0:4]

clf = tree.DecisionTreeClassifier(criterion="entropy")
clf = clf.fit(X, y)

# xuat model cay ra hinh
import graphviz 
from graphviz import Source
dot_data = tree.export_graphviz(clf, out_file=None)
graph = graphviz.Source(dot_data) 
graph.render("dtree_weather_entropy",view = True)
