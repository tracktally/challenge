#!/bin/make

dev:
	cd app; npm run dev -- --host

login:
	firebase login

firestore:
	firebase deploy --only firestore:rules