# chen cac package
import pandas as pd
import numpy as np
import os

from sklearn import tree
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# load du lieu
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
print("Training size: %d" % len(y_train))
print("Test size    : %d" % len(y_test))

from sklearn.tree import DecisionTreeClassifier 
clf= DecisionTreeClassifier()
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

print("Print results for 2 test data points:")
print("Predicted labels: ", y_pred[15:35])
print("Ground truth    : ", y_test[15:35])

print("Accuracy of Decision tree: %.2f %%" % ( 100 * accuracy_score(y_test, y_pred)))
print('Classification Report:\n{}\n'.format(classification_report(y_test,clf.predict(X_test))))