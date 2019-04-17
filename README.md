# Internal Corporate Prediction Market

This is my final project for the 7gate Blockchain Academy.

The idea is that a business can set up an internal prediction market, for the employees to bet on, to act as a source of information to be used in business decisions. This is an example market.

### Table of Contents

##### Prediction Market Background Info

 - [What's a prediction market?](#whats-a-prediction-market)
 - [Why does the market price tell you the probability?](#why-does-the-market-price-tell-you-the-probability)
 - [Why is this useful for business?](#why-is-this-useful-for-business)

##### Installation and dev setup

 - [Implementation Overview](#implementation-overview)
 - [Blockchain Backend Dev Setup](#blockchain-backend-dev-setup)
 - [Front-end Dev Setup](#front-end-dev-setup)

##### Other Information

 - [Prediction Market Accuracy](#prediction-market-accuracy)
 - [LMSR Market Maker](#lmsr-market-maker)

## Prediction Market Background Info

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

Note: the front end react app assumes the rest api is exposed on localhost:3000. If you set up the rest-api locally this should be correct. If you set it up on a google compute engine, you have to edit the IP address. This is in the ip_config.js file.

The front end is just a demo to show the rest API, and is missing a lot of features, and has a lot of hacky things hardcoded into it.

There are two pages, a trading page and a markets page. The trading page is meant to be used by regular employees to buy and sell tokens for all the different event markets. The markets page is to be used by management, to propose new questions and answer the existing ones.

In a full fledged solution, you would have authentication and show information for each user. This version just assumes there is a trader with ID 1. Thus, when you first start it with a new implementation of hyperledger, the trading page won't work, because there is no trader with ID 1. You have to create a trader with ID 1, using the rest api explorer. Then the trading page will allow you to buy and sell tokens as trader ID 1.

There will also be no markets to start. You can create one on the markets page.

## Other Information

### Prediction Market Accuracy

In almost every study I've seen, the probability estimates provided by a prediction market have been as good or better than any expert forecast. Below are some links to interesting studies on the accuracy of prediction markets as information gathering tools.

 - [Prediction market accuracy in the long run](https://doi.org/10.1016/j.ijforecast.2008.03.007)
   Looks at the accuracy of prediction markets vs polls for major US elections.
 - [Prediction Markets](http://www.aeaweb.org/articles?id=10.1257/0895330041371321)
   Overall study of different prediction market designs and their accuracy compared to other forecasting methods.
 - [Using prediction markets to estimate the reproducibility of scientific research](https://doi.org/10.1073/pnas.1516179112)
    A study that shows how prediction markets can be used to predict the outcomes of study replications well and outperformed a survey of market participants’ individual forecasts.
 - [Using Prediction Markets to Track Information Flows:  Evidence from Google](http://www.columbia.edu/~bc2656/GooglePredictionMarketPaper.pdf)
   An overview of Google's attempts at prediction markets and their accuracy
 - [Accuracy and Forecast Standard Error of Prediction Markets](http://repository.binus.ac.id/2009-1/content/D0264/D026473379.pdf)
 - [Sports forecasting: a comparison of the forecast accuracy of prediction markets, betting odds and tipsters](https://onlinelibrary.wiley.com/doi/abs/10.1002/for.1091)
 - [On the Forecast Accuracy of Sports Prediction Markets](https://link.springer.com/chapter/10.1007/978-3-540-77554-6_17)
 - [Prediction Markets: Does Money Matter?](https://www.tandfonline.com/doi/abs/10.1080/1019678042000245254)
 - [Prediction Markets in Theory and Practice](https://www.nber.org/papers/w12083.pdf)
 - [Prediction accuracy of different market structures — bookmakers versus a betting exchange](https://www.sciencedirect.com/science/article/pii/S0169207010000105)
 - [PREDICTION MARKETS: AN EXTENDED LITERATURE REVIEW](http://dx.doi.org/10.5750/jpm.v1i1.421)

### Market Maker

#### Liquidity Issues

The main factor in the accuracy of a prediction market is its liquidity. Or in simple terms, the more trades, the more accurate it is. Let's go through an example of how low liquidity is problematic.

First a few terms. In financial exchanges, a **bid** is an offer to buy something. And an **ask** is an offer to sell something. Thus a typical financial auction will consist of a bunch of bids, offers to buy at a certain price, and a bunch of asks, offers to sell. If a bid and an ask are made for the same price, then the trade is made.

What you typically get when looking at an auction order book is a difference in price between the highest bid and the lowest ask. This is called the spread. For example, if there was an apple auction, the highest posted bid might be $1.00 and the lowest posted ask might be $1.10. Anyone who wanted to instantly buy could buy for $1.10 and would match with the seller. Or they could post their own bid for $1.01 and hope that someone matches with them. The person is forced between having an instant match at a worse price, or waiting for the possibility that someone matches with you for a lower price.

When there aren't many people trading, these bid ask spreads tend to be huge. For example let's consider the same rain on Sunday token from earlier. Pretend we have 2 traders. One who owns a rain token, and one who is considering buying. The owner feels the probability of rain is 70%. So he'd be happy if he could sell his token for more than that. Say he sets his price at $0.80.

The buyer feels the probability of rain is only 50%. And he wants a deal so he is willing to buy it as long as it costs him less than $0.30.

Now our order book has a bid of $0.30 and an ask of $0.80. And no trades are made because the prices don't match.

The business manager looks at this prediction market, hoping to use it to get the true probability of rain on Sunday. But there's not one market price, there's a range $0.30 to $0.80. And the true probability could be anywhere in that range. Knowing that the probability is somewhere between 30% to 80% isn't very helpful.

#### LMSR Market Maker

The solution is to have a market maker. In traditional financial exchanges, this is someone who places trades on each side of the order book. They place bids and asks, with the idea that they can regularly buy at the lower bid price and sell at the ask price.

This code includes a Market Maker in the blockchain logic to prevent liquidity issues.

Conceptually it helps to think of the auction changing from between a person - person deal, to a person - company deal. We, the company take all trades with everyone else. Every trade isn't done between two individuals, but between an individual and us.

In a free auction, you let the people post bids and asks and any that match get sold. Now we have to post the prices that we are willing to trade for. This implementation uses something called the Logarithmic Market Scoring Rule (LMSR), to determine the current price that it is willing to sell or buy a token for.

Basically it starts each token at $0.50. And then as more people buy tokens, it slowly increases the price. And when more people are selling tokens it decreases the price. LMSR is a theoretically "optimal" mathematical way to change the price.

You can read about LMSR in a simple explanation [here](http://blog.oddhead.com/2006/10/30/implementing-hansons-market-maker/), or in it's original (very dense) research paper [here](http://mason.gmu.edu/~rhanson/mktscore.pdf).
