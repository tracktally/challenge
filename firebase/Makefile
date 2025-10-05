#!/bin/make

logout:
	firebase login

login:
	firebase login

deploy-dev:
	firebase use --add challenge-80397
	firebase deploy --only firestore:rules


deploy-prod:
	firebase use --add tracktally-prod
	firebase deploy --only firestore:rules
