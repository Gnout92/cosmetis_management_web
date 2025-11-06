# chen thu vien
import pandas as pd
import numpy as np
import os

# load du lieu va DT
from sklearn.datasets import load_iris
from sklearn import tree

# tach nhan va goi mo hinh
X,y = load_iris(return_X_y=True)
clf = tree.DecisionTreeClassifier(criterion='entropy')
clf = clf.fit(X, y)

# xuat model cay ra hinh
import graphviz 
from graphviz import Source
dot_data = tree.export_graphviz(clf, out_file=None)
graph = graphviz.Source(dot_data) 
graph.render("dtree",view = True)
