const N = require('natural');
const NC = new N.BayesClassifier();
const intents = {'greeting': [],'bye': [], 'step1': []};
const data = require('./d.json');

for (var key in data) {
  if (data.hasOwnProperty(key)) {
    data[key].forEach(function (string) {
      NC.addDocument(string, key);
    })
  }
}

NC.train();
module.exports = NC;
