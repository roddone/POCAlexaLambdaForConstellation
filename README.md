# POCAlexaLambdaForConstellation
[Proof Of Concept] Lambda function for Amazon's Alexa to consume Betaseries StateObjects from [@myconstellation](https://github.com/myconstellation)

This lambda is in French language

## input
**date** : date of the day you want to get the episodes _(optional, default : date of the day)_

## env
**ConstellationAccessKey** : your constellation access key
**AppId** : the APp Id of your ALexa Skill
**Lang** : the accent language to pronounce episode's titles _(optional)_

## How To

1) npm install
2) zip all files in the folder (index.js, package.json, package-lock.json and nodes_modules)
3) create a lambda function in AWS
4) upload the .zip package 
5) create a custom skill 
6) create an intent "recherche_series" with an intent slot named "date" of type "AMAZON.DATE" and some Sample Utterances like : 
	* les nouveautés de {date}
	* les nouveautés {date}
	* les séries de {date}
	* les séries {date}
	* les épisodes de {date}
	* les épisodes {date}
	* les nouveautés
	* les épisodes
	* les séries
7) call Alexa : ALexa, demande à betaseries les épisodes de (demain|aujourd'hui|Lundi|...)
