
# Firebase demo

The demo is divided into two applications: A webapp, and an app running on the local machine.


## The web app
The webapp requires no dependencies. To run it just open `electrike-remote/index.html` in a web browser.

The webapp does have privilages to make changes in the database, but it does not require a private key, because everyone has privilages to make changes in the database.

## The local app
The local app requires nodejs and npm to run, aswell as a private key to authenticate yourself as an owner of the database (See next section). The private key is required to be there for the app to work, but it is not technically required in order to make changes in the database.

Start by installing nodejs and npm using your favourite package manager.

Once you have installed nodejs and npm, run `npm install`. This will download firebase-admin and all of its dependencies, which is required to communicate with the database.

When that is finished, run the local app with `nodejs electrike-local/index.js`

## To get a private key

1. Go to [the Google Cloud console](https://console.cloud.google.com/iam-admin/serviceaccounts/details/102717217241415823834/keys?authuser=0&project=electrike-42dd1). Make sure you are on a Google account that has privileges in our database.

2. Click on `ADD KEY` -> `Create new key` -> `JSON` -> `Create`.

3. Move the downloaded file to the root of this repo and name it "`private-key.json`".

4. Do not commit anything to do with the key to the repo.
