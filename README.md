This is my final project for the 7gate Blockchain Academy.

It is a implementation of a predection market, using hyperledger composer.

It is meant to be used internally within a corporation for business decision making.

Overview

This project has 2 parts. (1) It contains the code neccessary to create a hyperledger fabric blockchain that implements a prediction market. This is the back-end. (2) I built a very simple react front end to interact with the blockchain. This is a demo of the web portal employees would use to interact with the blockchain.

Requirments

Hyperledger Composer for the backend
Nodejs for the front

Steps:

Hyperledger Composer has strict prerequisite version requirements, I recommend setting up a docker container or a google compute engine

For example: it requires Ubuntu Linux 14.04 / 16.04 LTS (both 64-bit), or Mac OS 10.12

Follow these instructions to install hyperledger composer pre-requisites:
https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html

Then download hyperledger composer tools and start a hyperledger fabric blockchain:
https://hyperledger.github.io/composer/latest/installing/development-tools.html

Now we will deploy our blockchain logic.

We will be following the steps in https://hyperledger.github.io/composer/latest/tutorials/developer-tutorial
with some changes.

The blockchain logic has 3 files. A cto file, a js file and a bna file.
The cto file is a composer model file. It controls the types of users and assets in the network. The js file controls the transaction logic.

The bna file is a business network archive, and is created from the other files. It is a prepacked file used to deploy the logic to hyperledger fabric.

If you change the business logic files, you have to create a new archive file, so follow the developer-tutorial linked above from step 3.

If you want to use the original bna with no changes, follow the tutorial from step 4, but subsituting in our bna file name in all the commands.

Now you should have a running blockchain, with a rest api exposing it.

Next, we will get the front end running. This can be on any dev enviorment that has nodejs.

Browse to pm_front and run npm install. Then npm run dev to run a dev server. It should be on localhost:4000.

*Note the front end react app assumes the rest api is exposed on localhost:3000. If you set up the rest-api locally this should be correct. If you set it up on a google compute, you have to edit the IP address. This is in the ip_config.js file.









