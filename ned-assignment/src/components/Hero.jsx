import { useEffect } from "react";
import { useState } from "react"
const Hero = () => {
    // eslint-disable-next-line no-unused-vars
    const [data, setData] = useState(null);
    const [revenue_amount, set_revenue_amount] = useState(0);
    const [funding_amount, set_funding_amount] = useState(0);

    const [radioInput, setRadioInput] = useState("weekly");                         //https://codesandbox.io/s/mlp6y?file=/src/App.js

    const[repaymentDropdownOpen, setRepaymentDropdownOpen] = useState(false);       //https://www.robinwieruch.de/react-dropdown/
    
    function handleRevenueChange(e){
        set_revenue_amount(e.target.value);
        console.log(revenue_amount);
    }

    function handleFundingChange(e){
        set_funding_amount(e.target.value);
        console.log(funding_amount);
    } 

    const radioChangeHandler = (e) => {
        setRadioInput(e.target.value);
    }

    const handleRepaymentDropdownOpen = () => {
        setRepaymentDropdownOpen(!repaymentDropdownOpen);
    };
    
    useEffect(() => {
        /* const getData = async () => {
            try {
            const response = await fetch('https://raw.githubusercontent.com/Ned-Helps/demo-repository/main/config.json');
            if (!response.ok) {
                throw new Error(
                    `This is an HTTP error: The status is ${response.status}`
                );
            }
            let actualData = await response.json();
            setData(actualData);
            setError(null);
        } catch(err) {
            setError(err.message);
            setData(null);
        } 
    }
    getData()
        */
        fetch('https://raw.githubusercontent.com/Ned-Helps/demo-repository/main/config.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return (response.json());
            })
            .then((actualData) => {
                setData(actualData)
                console.log(actualData)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    //Map each array object from json using name (eg. revenue_amount) as the key
    const dataStuff = new Map([]);
    for (let i = 0; i < data?.length; i++) {
        dataStuff.set(`${data[i].name}`, data[i]);
    }

    //Annual Business Revenue Items
    var businessRevenueLabel = dataStuff.get('revenue_amount')?.label;
    var businessRevenuePlaceholder = dataStuff.get('revenue_amount')?.placeholder;

    //Loan Amount Items
    var loanLabel = dataStuff.get('funding_amount')?.label;
    var loanValue = dataStuff.get('funding_amount')?.value;   
    var loanValueInt = eval(loanValue);                                         //Evaluate loan value equation

    //Revenue Share Percentage Items
    var revenuePercentLabel = dataStuff.get('revenue_percentage')?.label;
    var revenuePercentValue = dataStuff.get('revenue_percentage')?.value;
    var revenuePercentValueNum = eval(revenuePercentValue);                     //Evaluate revenue share percentage equation
    var revenuePercentValuePercent = revenuePercentValueNum*100;

    //Revenue Share Frequency Items
    var revenueShareFreqLabel = dataStuff.get('revenue_shared_frequency')?.label;
    var revenueShareFreqValue = dataStuff.get('revenue_shared_frequency')?.value;
    var revenueShareFreqArr = revenueShareFreqValue?.split("*");                //Split revenue share frequency values into array


    //Desired Repayment Delay Items
    var repaymentDelayLabel = dataStuff.get('desired_repayment_delay')?.label;
    var repaymentDelayValue = dataStuff.get('desired_repayment_delay')?.value;
    var repaymentDelayValueArr = repaymentDelayValue?.split("*"); 

    //Use Of Funds Items
    var useOfFundsLabel = dataStuff.get('use_of_funds')?.label;
    var useOfFundsValue = dataStuff.get('use_of_funds')?.value;

    //Results Section Items:
    //Fees
    var desiredFeesValue = Number(dataStuff.get('desired_fee_percentage')?.value);
    var feePercentage = Number(desiredFeesValue*100);
    var feeAmount = Number(desiredFeesValue*funding_amount);
    var totalRevenueShare = Number(funding_amount)+feeAmount;


    return (
        <div className="flex flex-col bg-primary-grey h-screen">

            <div className="h-screen">
                <div className="flex flex-row justify-center space-x-3 h-5/6">
                    <div className="bg-white w-3/6 mt-20 px-20 pt-3 rounded-lg shadow-lg financing-options text-sm">
                        {/*<FinancingOptions items={data} />*/}
                        <div className="pb-5">
                            <h1 className="text-xl font-semibold">
                                Financing options
                            </h1>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="revenue-amount">
                                <h2>{businessRevenueLabel}</h2>
                                <input type="number" className="bg-primary-grey w-4/6 h-10" placeholder={businessRevenuePlaceholder} onChange={handleRevenueChange}></input>
                            </div>

                            <div className="loan-amount">
                                <h2>{loanLabel}</h2>
                                <h2>*slider here*{loanValueInt}</h2>
                                <input type="number" className="bg-primary-grey w-4/6 h-10" onChange={handleFundingChange}></input>
                            </div>

                            <div className="repayment-rate">
                                <h2>{revenuePercentLabel}: <span className="text-button-blue">{/*round to nearest 2 decimals*/Math.round(revenuePercentValuePercent*100)/100}%</span></h2>
                            </div>

                            <div className="repayment-frequency" >
                                <h2 className="flex flex-row">{revenueShareFreqLabel}:
                                    <span className="flex flex-row space-x-5 pl-5">
                                        {revenueShareFreqArr?.map((revenueShareFreqItems) => (
                                            <div key={revenueShareFreqItems}>  
                                                <input id={revenueShareFreqArr.indexOf(revenueShareFreqItems)} 
                                                       type="radio" 
                                                       name="radio-buttons" 
                                                       value={revenueShareFreqItems} 
                                                       onChange={radioChangeHandler} 
                                                       checked={radioInput === `${revenueShareFreqItems}`}/>
                                                       
                                                    <label> {revenueShareFreqItems}</label>
                                            </div>
                                        ))}
                                    </span>
                                    Selected: {radioInput}  
                                </h2>
                            </div>

                            <div className="repayment-delay flex flex-row">
                                <h2>Desired {repaymentDelayLabel}: *dropdown    *</h2>
                            </div>

                            <div className="fund-uses">
                                <h2>{useOfFundsLabel}</h2>
                                <div className="flex flex-row">
                                    <h2>*Use of funds drop down*{useOfFundsValue}</h2>
                                    <h2>*description input*</h2>
                                    <h2>*amount input*</h2>
                                    <h2>*add button*</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-2/6 mt-20 px-20 pt-3 rounded-lg shadow-lg  results">
                        <div className="pb-5">
                            <h1 className="text-xl font-semibold">
                                Results
                            </h1>
                        </div>
                        <div className="flex flex-col space-y-3 font-semibold">
                            <div className="flex flex-row">
                                <h2>Annual Business Revenue: </h2>
                                <span className="ml-auto">${revenue_amount}</span>
                            </div>

                            <div className="flex flex-row">
                                <h2>Funding Amount: </h2>
                                <span className="ml-auto">${funding_amount}</span>
                            </div>

                            <div className="flex flex-row">
                                <h2>Fees: </h2>
                                <span className="ml-auto">({feePercentage}%) ${feeAmount}</span>
                            </div>

                            <div></div>

                            <div className="flex flex-row">
                                <h2>Total Revenue Share</h2>
                                <span className="ml-auto">${totalRevenueShare}</span>
                            </div>
                            
                            <div>
                                <h2>Expected transfers</h2>
                            </div>

                            <div>
                                <h2>Expected completion date </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center space-x-96 bg-white pb-12">
                <button type="button" className="text-button-blue bg-white border border-button-blue hover:bg-button-blue rounded-lg text-sm px-36 py-2.5 mr-2 mb-2">BACK</button>
                <button type="button" className="text-white bg-button-blue border-button-blue hover:bg-white rounded-lg text-sm px-36 py-2.5 mr-2 mb-2">NEXT</button>
            </div>
        </div>
    )
}

export default Hero