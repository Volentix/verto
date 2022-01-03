const Web3 = require('web3');

const compiledContractABI = require('./HEX.abi.json');

const hexAddr = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39";

const findStakeAndIndex = async (addr, stakeId) => {
    let stakes = await hex.stakeList(addr);
    for(let i = 0; i < stakes.length; i++){
        if(stakes[i].stakeId === stakeId){
            return [i, stakes[i]];
        }
    }
    return [];
}

const HEARTS_UINT_SHIFT = 72n;
const HEARTS_MASK = (1n << HEARTS_UINT_SHIFT) - 1n;
const SATS_UINT_SHIFT = 56n;
const SATS_MASK = (1n << SATS_UINT_SHIFT) - 1n;
const decodeDailyData = (encDay) => {
    let v = BigInt(encDay);
    let payout = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let shares = v & HEARTS_MASK;
    v = v >> HEARTS_UINT_SHIFT;
    let sats = v & SATS_MASK;
    return {payout, shares, sats}; 
}

const interestForRange = (dailyData, myShares) => {
    return dailyData.reduce((s, d) => s + interestForDay(d, myShares), 0n);
}

const interestForDay = (dayObj, myShares) => {
    return myShares * dayObj.payout / dayObj.shares;
}

const encodeData = (dayObj) => {
    let v = dayObj.sats;
    v = v << HEARTS_UINT_SHIFT;
    v |= dayObj.shares;
    v = v << HEARTS_UINT_SHIFT;
    v |= dayObj.payout;
    return v;
}

const getDataRange = async (hex, b, e) => {
	const dataRange = await hex
        .methods
        .dailyDataRange(b, e)
		.call();
    const data = [];
    for(let i = 0; i < dataRange.length; i++){
        data.push(decodeDailyData(dataRange[i]));
    }
    return data;
};

const getStake = async (hex, addr, sid) => {
    let stakeCount = await hex.methods.stakeCount(addr).call();
    for(let i = 0; i < stakeCount; i++){
        let stake = await hex.methods.stakeLists(addr, i).call();
        if(stake.stakeId === sid.toString()){
            return stake;
        }
    }
}

const getStakeByIndex = async (hex, addr, idx) => {
    let stake = await hex.methods.stakeLists(addr, idx).call();
    return stake;
}

const getLastDataDay = async (hex) => {
    let globalInfo = await hex.methods.globalInfo().call();
    const lastDay = globalInfo[4];
    return Number.parseInt(lastDay);
}

const getInterestToDate = async (hex, addr, stakeId, stakeIndex, stake) => {
    let s;
    if(stake !== undefined){
        s = stake;
    } else if(stakeIndex !== undefined){
        s = await getStakeByIndex(hex, addr, stakeIndex);
    } else {
        s = await getStake(hex, addr, stakeId);
    } // Not validating that I have both things correct/matching, error detection needed

    const b = Number.parseInt(s.lockedDay);
    const e = await getLastDataDay(hex); // ostensibly "today"

    if (b >= e) {
        //not started - error
        return 0n;
    } else {
        const data = await getDataRange(hex, b, e);
        return interestForRange(data, BigInt(s.stakeShares));
    }
}

const getTotalValue = async (hex, addr, stakeId, stakeIndex) => {
    let stake;
    if(stakeIndex !== undefined){
        stake = await getStakeByIndex(hex, addr, stakeIndex);
    } else {
        stake = await getStake(hex, addr, stakeId);
    }
    const interest = await getInterestToDate(hex, addr, stakeId, stakeIndex, stake);
    return BigInt(stake.stakedHearts) + interest;
}

let uri = null; // some JSON RPC uri, like infura

const web3 = new Web3(uri);
let hex = new web3.eth.Contract(compiledContractABI, hexAddr);

// examples
getInterestToDate(hex, testAddr, undefined, 5)
.then(console.log);


getTotalValue(hex, testAddr, testStakeId)
.then(console.log);