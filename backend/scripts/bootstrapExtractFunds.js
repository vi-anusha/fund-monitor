import {safeInsertFundsBatch, getFundCodes} from "../dal/fundDAL.js"
import axios from "axios";

// Extracting fund metadata and insert into funds table
async function extractFunds(){
    await axios.get("https://api.mfapi.in/mf")
    .then(res => {
        const data = res.data
        const fundsToInsert = data.map(fund => ({
            code: fund.schemeCode,
            name: fund.schemeName
        }))
        // Insert all funds in one transaction
        safeInsertFundsBatch(fundsToInsert);
        console.log(`✅ Successfully inserted ${fundsToInsert.length} funds`);
    })
    .catch(error => console.log(error));
}

extractFunds()
