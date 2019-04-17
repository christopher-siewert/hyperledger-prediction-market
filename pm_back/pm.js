
/* global getAssetRegistry getFactory emit */

// Cost function according to LMSR
function costCalc(q1, q2) {
  	const b = 100
    return b * Math.log(Math.exp(q1/b) + Math.exp(q2/b))
}


/**
 * Buy shares in a market.
 * @param {org.example.basic.BuyShares} tx The sample transaction instance.
 * @transaction
 */
async function buyShares(tx) {

    // Create new factory, which is used to create new assets
  	var factory = getFactory()
	  var NS = "org.example.basic"

  	let trader = tx.trader
    let market = tx.market

    // Shouldn't be able to trade if the market is over
    if (market.isResolved == true) {
    	throw new Error("Market is resolved")
    }
  	let q1 = market.yesShares
    let q2 = market.noShares

    // Cost differs if you are buying yes or no tokens
    let cost
    if (tx.type == "YES") {
      // According to LMSR you take difference in cost functions when you add
      // new shares
    	cost = costCalc(q1 + tx.amount, q2) - costCalc(q1, q2)
    } else {
    	cost = costCalc(q1, q2 + tx.amount) - costCalc(q1, q2)
    }

    // Prevent against overspending
    if (trader.balance < cost) {
    	throw new Error("Balance too low")
    }

    // Deduct balance
  	trader.balance -= cost

  	// Search for this particular market in trader array of shares
  	var index = -1;

  	for (let i = 0; i < trader.shares.length; i++) {
    	if (trader.shares[i].market.marketId == market.marketId) {
          	index = i
            break
        }
    }

  	// If not found, push new object and set index to last
  	if (index == -1) {
        // Factory object is a composer object to create new objects
      	var share = factory.newConcept(NS, 'Shares')
        share.market = factory.newRelationship(NS, 'Market', market.marketId)
      	share.yesShares = 0
      	share.noShares = 0
    	  trader.shares.push(share)
      	index = trader.shares.length - 1
    }
    // Now index is index of the proper market
    // Add amount of shares purchased to market total, and to trader array
  	if (tx.type == "YES") {
    	  market.yesShares += tx.amount
      	trader.shares[index].yesShares += tx.amount
    } else {
    	  market.noShares += tx.amount
      	trader.shares[index].noShares += tx.amount
    }

    // Get the participant registry.
    const participantRegistry = await getParticipantRegistry('org.example.basic.Trader');
    // Update the asset in the asset registry.
    await participantRegistry.update(trader);

    // Get the asset registry.
    const assetRegistry = await getAssetRegistry('org.example.basic.Market');
    // Update the asset in the asset registry.
    await assetRegistry.update(market);
}


/**
 * Sell shares in a market.
 * @param {org.example.basic.SellShares} tx The sample transaction instance.
 * @transaction
 */
async function sellShares(tx) {

    // Composer factory object
  	var factory = getFactory()
	  var NS = "org.example.basic"

  	let trader = tx.trader
    let market = tx.market

    // Can't sell shares if market is done
	  if (market.isResolved == true) {
    	throw new Error("Market is resolved")
    }

    // Search for existing market
    var index = -1;

    // Loop through looking for matching ID
  	for (let i = 0; i < trader.shares.length; i++) {
    	if (trader.shares[i].market.marketId == market.marketId) {
          	index = i
            break
        }
    }

    // If index doesn't get updated, marekt doesn't exist in array
  	if (index == -1) {
    	throw new Error("No existing shares")
    }
    // Now index is index of correct market in trader array
  	let q1 = tx.market.yesShares
    let q2 = tx.market.noShares

    // If selling yes shares
  	if (tx.type == "YES") {
        // If you aren't trying to sell too many
    	  if (trader.shares[index].yesShares < tx.amount) {
        	throw new Error("Not enough shares")
        }
        // Decrement trader shares and market total of shares
      	trader.shares[index].yesShares -= tx.amount
      	market.yesShares -= tx.amount
        // Increase trader balance by the amount according to LMSR
      	trader.balance -= costCalc(q1 - tx.amount, q2) - costCalc(q1, q2)
    } else { // If selling no shares
        // If you aren't trying to sell too many
    	  if (trader.shares[index].noShares < tx.amount) {
        	throw new Error("Not enough shares")
        }
        // Decrement no shares of trader and market total in circulation
      	trader.shares[index].noShares -= tx.amount
      	market.noShares -= tx.amount
        // Increase trader balance by the amount according to LMSR
      	trader.balance -= costCalc(q1, q2 - tx.amount) - costCalc(q1, q2)
    }

  	    // Get the participant registry.
    const participantRegistry = await getParticipantRegistry('org.example.basic.Trader');
    // Update the asset in the asset registry.
    await participantRegistry.update(trader);

    // Get the asset registry.
    const assetRegistry = await getAssetRegistry('org.example.basic.Market');
    // Update the asset in the asset registry.
    await assetRegistry.update(market);
}

/**
 * Resolve a market.
 * @param {org.example.basic.ResolveMarket} tx The sample transaction instance.
 * @transaction
 */

async function resolveMarket(tx) {
    // Provide an answer to a market and stop trading
  	let market = tx.market
    market.answer = tx.answer
  	market.isResolved = true

     // Get the asset registry.
    const assetRegistry = await getAssetRegistry('org.example.basic.Market');
    // Update the asset in the asset registry.
    await assetRegistry.update(market);

}

/**
 * Claim profits.
 * @param {org.example.basic.ClaimProfits} tx The sample transaction instance.
 * @transaction
 */

async function claimProfits(tx) {
    // Burns all tokens of trader, gives back $
  	let market = tx.market
    let trader = tx.trader

    if (market.isResolved == false) {
    	throw new Error("Market is not yet resolved")
    }

    // Search for existing market
    var index = -1;

  	for (let i = 0; i < trader.shares.length; i++) {
    	if (trader.shares[i].market.marketId == market.marketId) {
          	index = i
            break
        }
    }
    // Now index is either -1 if no market exists, or is correct index
    // in the trader array of markets
  	if (index == -1) {
    	throw new Error("No existing shares")
    }

    // Payment depends on yes or no tokens
  	let payment
  	if (market.answer == "YES") {
    	payment = trader.shares[index].yesShares
    } else {
    	payment = trader.shares[index].noShares
    }

    // Decrease total in circulation
  	market.yesShares -= trader.shares[index].yesShares
  	market.noShares -= trader.shares[index].noShares
    // Set trader shares to 0
  	trader.shares[index].yesShares = 0
  	trader.shares[index].noShares = 0
    // Pay trader $1 for each correct token
    trader.balance += payment

 	// Get the participant registry.
    const participantRegistry = await getParticipantRegistry('org.example.basic.Trader');
    // Update the asset in the asset registry.
    await participantRegistry.update(trader);

    // Get the asset registry.
    const assetRegistry = await getAssetRegistry('org.example.basic.Market');
    // Update the asset in the asset registry.
    await assetRegistry.update(market);

}
