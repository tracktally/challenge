#!/bin/make

dev:
	cd app; npm run dev -- --host

login:
	cd firebase; firebase login

firestore:
	cd firebase; firebase deploy --only firestore:rules