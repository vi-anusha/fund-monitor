import {getFundCodes, getFundId} from "../dal/fundDAL.js"
import {insertNavsBatch} from "../dal/navDAL.js"
import axios from "axios";

// Extracting fund nav history and insert into nav history table
async function extractNavHistory(fundCode){
    return await axios.get(`https://api.mfapi.in/mf/${fundCode}`)
    .then(res => {
        const result = res.data
        const navs = result.data
        if (navs){
            const monthMap = new Map();
            navs.forEach(row => {
                const date = new Date(row.date.split('-').reverse().join('-'))
                const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                if(!monthMap.has(yearMonth) || date > monthMap.get(yearMonth).date){
                    monthMap.set(yearMonth, {
                        date: date,
                        nav: parseFloat(row.nav),
                        originalDate: row.date
                    });
                }
            })
            const navHistory = Array.from(monthMap.values()).map(item => ({
                date: item.date,
                nav: item.nav
            }));
            return navHistory;
        }
        return [];
    })
    .catch(error => {
            console.log(error);
            return [];
        });
}

// compute correction for the nav data
function calculateCorr(navHistory){
    navHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    navHistory.forEach((row, index) => {
        row.correction = 0.0
        if(index > 0){
            row.correction = parseFloat((((row.nav/navHistory[index-1].nav) - 1)*100).toFixed(4));
        }
    });
    return navHistory
}

async function extractAllNavs(){
    let fundCodes = getFundCodes()
    fundCodes = fundCodes.slice(1500, fundCodes.length)
    for (const row of fundCodes) {  // ✅ Process one by one
        try {
            console.log(row)
            const navHistory = await extractNavHistory(row)
            const correctionNav = calculateCorr(navHistory)
            const fundId = getFundId(row)[0]
            const finalNavs = correctionNav.map(item => ({
                ...item,
                fund_id: fundId
            }))
            insertNavsBatch(finalNavs)
            // Add delay between requests
            await new Promise(resolve => setTimeout(resolve, 100)); // 1000ms delay
        } catch (error) {
            console.error(`Error processing ${row}:`, error.message);
        }
    }
}

extractAllNavs()
