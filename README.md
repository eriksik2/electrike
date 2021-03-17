
# Firebase demo

The demo is divided into two applications: A webapp, and an app running on the local machine.


## webapp
The webapp requires no dependencies. To run it just open `electrike-remote/index.html` in a web browser.

The webapp does not have privilages to make changes in the database, so it does not require a private key.

## local app
The local app requires nodejs and npm to run, aswell as a private key to authenticate yourself as an owner of the database (See next section).

Start by installing nodejs and npm using your favourite package manager.
Once you have installed nodejs and npm, you run `npm install`. This will download firebase-admin and all of its dependencies, which is required to communicate with the database.

When that is finished, you run the local app with `nodejs electrike-local/index.js`

## To get a private key

Go to https://console.cloud.google.com/iam-admin/serviceaccounts/details/102717217241415823834/keys?authuser=0&project=electrike-42dd1.

Log in with a google account that has owner privileges in our database.

Click on `ADD KEY` -> `Create new key` -> `JSON` -> `Create`.

Move the downloaded file to the root of this repo and name it "`private-key.json`". Do not commit anything to do with the key to the repo.