# Internal Corporate Prediction Market

This is my final project for the 7gate Blockchain Academy.

The idea is that a business can set up an internal prediction market, for the employees to bet on, to act as a source of information to be used in business decisions. This is an example market.

### Table of Contents

#####Prediction Market Background Info

 - [What's a prediction market?](#what's-a-prediction-market?)
 - [Why does the market price tell you the probability?](#why-does-the-market-price-tell-you-the-probability?)
 - [Why is this useful for business?](#why-is-this-useful-for-business?)

#####Installation and dev setup
 - [Implementation Overview](#implementation-overview)
 - [Blockchain Backend Dev Setup](#blockchain-backend-dev-setup)
 - [Front-end Dev Setup](#front-end-dev-setup)

##Prediction Market Background Info

### What's a prediction market?

A prediction market is a financial market (like a stock exchange) that allows people to trade tokens with values that depend on the outcome of some future event.

For example there might be a token that says, "This token is worth $1 if it rains next Sunday." Then through the market, people could make offers to buy and sell this token. On Sunday, the person who holds the token gets $1 if it rains, and $0 if it doesn't rain. And just like with stocks, you usually don't have to hold a physical piece of paper or anything, the exchange just keeps track of which tokens you own and pays you out if they become worth money.

When people buy and sell the tokens, the market price becomes an estimate of the "true" probability of the event.

### Why does the market price tell you the probability?

If the market price of a token differs from the probability of an event happening then there is free money on the table that people will eat up.

For example: I live in the rain forest and it rains all the time. It rains 4 out of every 5 days. Thus the probability of rain is 80%. If the token was selling at $0.40, I could make an expected profit. I decide to buy the token.

If it doesn't rain, I'm out $0.40, and the token is worthless.

If it does rain, I paid $0.40 for the token, that became worth $1, for a net gain of $0.60.


Thus 20% of the time (no rain) I lose $0.40 and 80% of the time (rain) I gain $0.60 for an expected value of (20%)($-0.40) + (80%)($0.60) or $0.40.

Thus I can expect to earn on average $0.40 for each token I buy.

Notice that this amount I earn is exactly the same as the true probability minus the market price (0.80 - $0.40). 

You can always make expected profit up until the point that the market price is equal to the probability.



### Why is this useful for business?

When people buy and sell the tokens, the market price becomes an estimate of the "true" probability of the event. 

Thus, you get people to bet on events that are important to your business. For example: "This token is worth $1 if development for the new Apple iPhone is completed on time."

You let people buy and sell that token. Now when the market price is $0.55, that tells you the probability is 55%.

This is incredibly useful information for an Apple executive. They know their development is likely to be delayed. Then when they hire a new project manager and the market price suddenly shoots up to $0.95 they know that the new guy is seriously fixing things.

## Implementation Overview

This project has 2 parts. (1) It contains the code neccessary to create a hyperledger fabric blockchain that implements a prediction market. This is the back-end. (2) I built a very simple react front end to interact with the blockchain. This is a demo of the web portal employees would use to interact with the blockchain.


### Blockchain Backend Dev Setup

##### Requirements

 - Ubuntu 14.04 or 16.04 (both 64-bit), or Mac OS 10.12
 - Docker Engine: Version 17.03 or higher
 - Docker-Compose: Version 1.8 or higher
 - Node: 8.9 or higher (note version 9 and higher is not supported)
 - npm: v5.x
 - git: 2.9.x or higher
 - Python: 2.7.x

##### Steps

1. Install hyperledger composer pre-requisites according to [these instructions](https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html).

2. Download hyperledger composer tools and start a hyperledger fabric blockchain according to [these instructions](https://hyperledger.github.io/composer/latest/installing/development-tools.html).


3. Now we will deploy our blockchain logic.

We will be following [these steps](https://hyperledger.github.io/composer/latest/tutorials/developer-tutorial) 
with some changes.

All the back-end files are in `/pm_back/`

The blockchain logic has 3 files. A cto file, a js file and a bna file.
The cto file is a composer model file. It controls the types of users and assets in the network. The js file controls the transaction logic.

The bna file is a business network archive, and is created from the other files. It is a prepacked file used to deploy the logic to hyperledger fabric.

If you change the business logic files, you have to create a new archive file; the instructions are linked above.

If you want to use the original bna with no changes, follow the linked instructions from step 4, but substitute in the bna file name in all the commands.

Now you should have a running blockchain, with a rest api exposing it.

### Front-end Dev Setup

Next, we will get the front end running. This can be on any dev environment that has a recent version of nodejs.

Browse to pm_front and run npm install. Then npm run dev to run a dev server. It should be on localhost:4000.

Note: the front end react app assumes the rest api is exposed on localhost:3000. If you set up the rest-api locally this should be correct. If you set it up on a google compute, you have to edit the IP address. This is in the ip_config.js file.









