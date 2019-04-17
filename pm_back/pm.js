
/* global getAssetRegistry getFactory emit */

function costCalc(q1, q2) {
  	const b = 100
    return b * Math.log(Math.exp(q1/b) + Math.exp(q2/b))
}


/**
 * Buy shares in a market.
 * @param {org.example.basic.BuyShares} tx The sample transaction instance.
 * @transaction
 */
async function buyShares(tx) {  // eslint-disable-line no-unused-vars
  
  	var factory = getFactory()
	var NS = "org.example.basic"

  	let trader = tx.trader
    let market = tx.market
  
    if (market.isResolved == true) {
    	throw new Error("Market is resolved")
    }
  	let q1 = market.yesShares
    let q2 = market.noShares 
    
    let cost
    if (tx.type == "YES") {
    	cost = costCalc(q1 + tx.amount, q2) - costCalc(q1, q2)
    } else {
    	cost = costCalc(q1, q2 + tx.amount) - costCalc(q1, q2)
    }
    
    if (trader.balance < cost) {
    	throw new Error("Balance too low")
    }
    
  	trader.balance -= cost
  	
  	// Search for market in trader array of shares
  	var index = -1;
  
  	for (let i = 0; i < trader.shares.length; i++) {
    	if (trader.shares[i].market.marketId == market.marketId) {
          	index = i
            break
        }
    }
  	
  	// If not found, push and set index to last
  	if (index == -1) {
      	var share = factory.newConcept(NS, 'Shares')
        share.market = factory.newRelationship(NS, 'Market', market.marketId)
      	share.yesShares = 0
      	share.noShares = 0
    	trader.shares.push(share)
      	index = trader.shares.length - 1
    }
    // Now index is index of the proper market
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
async function sellShares(tx) {  // eslint-disable-line no-unused-vars
  
  	var factory = getFactory()
	var NS = "org.example.basic"

  	let trader = tx.trader
    let market = tx.market
  	
	if (market.isResolved == true) {
    	throw new Error("Market is resolved")
    }
  
    // Search for existing market
    var index = -1;
  
  	for (let i = 0; i < trader.shares.length; i++) {
    	if (trader.shares[i].market.marketId == market.marketId) {
          	index = i
            break
        }
    }
  
  	// Now index is index of correct market in trader array
  	if (index == -1) {
    	throw new Error("No existing shares")
    }
  
  	let q1 = tx.market.yesShares
    let q2 = tx.market.noShares 
    
  	if (tx.type == "YES") {
    	if (trader.shares[index].yesShares < tx.amount) {
        	throw new Error("Not enough shares")
        }
      	trader.shares[index].yesShares -= tx.amount
      	market.yesShares -= tx.amount
      
      	trader.balance -= costCalc(q1 - tx.amount, q2) - costCalc(q1, q2)
    } else {
    	if (trader.shares[index].noShares < tx.amount) {
        	throw new Error("Not enough shares")
        }
      	trader.shares[index].noShares -= tx.amount
      	market.noShares -= tx.amount
      
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
  
  	// Now index is index of correct market in trader array
  	if (index == -1) {
    	throw new Error("No existing shares")
    }
  	
  	let payment
    
  	if (market.answer == "YES") {
    	payment = trader.shares[index].yesShares   	
    } else {
    	payment = trader.shares[index].noShares
    }
  
  	market.yesShares -= trader.shares[index].yesShares
  	market.noShares -= trader.shares[index].noShares
  	trader.shares[index].yesShares = 0
  	trader.shares[index].noShares = 0

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