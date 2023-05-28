import { useEffect } from "react";
import { useState } from "react"
import { MdAddCircleOutline } from "react-icons/md"
import { BsFillTrash3Fill } from "react-icons/bs"

const Hero = () => {
    // eslint-disable-next-line no-unused-vars
    const [data, setData] = useState(null);
    const [revenue_amount, set_revenue_amount] = useState(0);
    const [funding_amount, set_funding_amount] = useState(0);
    const [radioInput, setRadioInput] = useState("weekly");                         //https://codesandbox.io/s/mlp6y?file=/src/App.js
    const [repaymentDelay, setRepaymentDelay] = useState("");

    //Fund uses states
    const [fundUseCategory, setfundUseCategory] = useState("Marketing");
    const [fundUseDescription, setFundUseDescription] = useState("");
    const [fundUseAmount, setFundUseAmount] = useState(0);

    const [fundUses, setFundUses] = useState([]);                                   //Array of objects


    function handleRevenueChange(e) {
        set_revenue_amount(e.target.value);
    }

    function handleFundingChange(e) {
        set_funding_amount(e.target.value);
    }

    const radioChangeHandler = (e) => {
        setRadioInput(e.target.value);
    }

    const repaymentDelayChangeHandler = (e) => {
        setRepaymentDelay(e.target.value);
    }


    //Fund use handlers
    const fundUseCategoryChangeHandler = (e) => {
        setfundUseCategory(e.target.value);
    }

    const handleFundUseDescriptionChange = (e) => {
        setFundUseDescription(e.target.value);
    }

    function handleFundUseAmountChange(e) {
        setFundUseAmount(e.target.value);
    }

    function handleAddFundUse() {
        const updateFundUses = [
            ...fundUses,
            {
                id: fundUses.length,
                fundType: fundUseCategory,
                description: fundUseDescription,
                amount: fundUseAmount,
            }
        ]
        setFundUses(updateFundUses);
    }

    const removeObjectWithId = (index) => {
        const deleteFundUses = [...fundUses];
        setFundUses(deleteFundUses.filter((_, i) => i !== index));
    }


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
    var revenuePercentMin = dataStuff.get('revenue_percentage_min')?.value;
    var revenuePercentMax = dataStuff.get('revenue_percentage_max')?.value;
    var revenuePercentValueNum = eval(revenuePercentValue);                     //Evaluate revenue share percentage equation
    var revenuePercentValuePercent = revenuePercentValueNum * 100;


    //if revenue percentage value is less than minimum or greater than maximum, set it to min or max
    if (revenuePercentValuePercent < revenuePercentMin) {
        revenuePercentValuePercent = revenuePercentMin;
    }
    else if (revenuePercentValuePercent > revenuePercentMax) {
        revenuePercentValuePercent = revenuePercentMax;
    }

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
    var useOfFundsArr = useOfFundsValue?.split("*");

    //Funding Amount Min and Max (for bonus)
    var fundingMin = dataStuff.get('funding_amount_min')?.value;
    var fundingMax = dataStuff.get('funding_amount_max')?.value;

    
    if(loanValueInt < fundingMax)
    {
        fundingMax = Math.round(loanValueInt * 100) / 100;

    }

    //Results Section Items:
    //Fees
    var desiredFeesValue = Number(dataStuff.get('desired_fee_percentage')?.value);

    //Fee Percentages
    var feePercentage = Number(desiredFeesValue * 100);

    //Fee amounts
    var feeAmount = Number(desiredFeesValue * funding_amount);
    var totalRevenueShare = Number(funding_amount) + feeAmount;
    var expectedTransfers = 0;
    var expectedTransfersInDays = 0;
    if (radioInput == "weekly") {
        expectedTransfers = (totalRevenueShare * 52) / (revenue_amount * revenuePercentValueNum);
    }
    else if (radioInput == "monthly") {
        expectedTransfers = (totalRevenueShare * 12) / (revenue_amount * revenuePercentValueNum);
    }
    expectedTransfersInDays = (totalRevenueShare * 365) / (revenue_amount * revenuePercentValueNum);

    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var repaymentDelayDaysInt = Number(repaymentDelay.replace(/\D/g, ""));

    var d = new Date();
    /*
    if (radioInput == "weekly") {
        var expectedCompletionDateWeekly = date.setDate(date.getDate() + (expectedTransfers*7) + repaymentDelayDaysInt)
        d = new Date(expectedCompletionDateWeekly);
    }
    else if (radioInput == "monthly") {
        var expectedCompletionDateMonth = date.setDate(date.getDate() + (expectedTransfers*30) + repaymentDelayDaysInt)
        d = new Date(expectedCompletionDateMonth);
    }
    */
    var expectedCompletionDate = date.setDate(date.getDate() + expectedTransfersInDays + repaymentDelayDaysInt)
    d = new Date(expectedCompletionDate);

    var formattedDate = `${monthNames[d.getMonth()]} ` + `${d.getDate()}` + "," + ` ${d.getFullYear()}`;

    const expectedAPR = ((((desiredFeesValue*funding_amount))/funding_amount)/(expectedTransfersInDays))*365*100;
    
    return (
        <div className="flex flex-col bg-primary-grey h-screen">

            <div className="h-screen">
                <div className="flex flex-row justify-center space-x-3 h-vscreen">
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
                                <div className="flex flex-row space-x-72">
                                    <h2>${fundingMin} </h2>
                                    <h2 className="pl-2">${fundingMax} </h2>
                                </div>
                                <div className="flex flex-row">
                                    <input name="rangeAmount" type="range" className="bg-primary-grey w-4/6 h-10" min={fundingMin} max={fundingMax} onChange={handleFundingChange}></input>
                                    <input name="amount" type="number" className="bg-primary-grey w-1/6 h-6" min={fundingMin} max={fundingMax} onChange={handleFundingChange}></input>
                                </div>

                            </div>

                            <div className="repayment-rate">
                                <h2>{revenuePercentLabel}: <span className="text-button-blue">{/*round to nearest 2 decimals*/Math.round(revenuePercentValuePercent * 100) / 100}%</span></h2>
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
                                                    checked={radioInput === `${revenueShareFreqItems}`} />

                                                <label> {revenueShareFreqItems}</label>
                                            </div>
                                        ))}
                                    </span>
                                </h2>
                            </div>

                            <form className="repayment-delay flex flex-row space-x-5">
                                <label htmlFor="repaymentDelay">Desired {repaymentDelayLabel}:</label>
                                <select className="border repayment-delay-dropdown" value={repaymentDelay} onChange={repaymentDelayChangeHandler}>
                                    {repaymentDelayValueArr?.map((repaymentDelayItems) => (
                                        <option key={repaymentDelayItems} value={repaymentDelayItems}>
                                            {repaymentDelayItems}
                                        </option>
                                    ))}
                                </select>
                            </form>

                            <div className="fund-uses">
                                <h2 className="pb-5">{useOfFundsLabel}</h2>
                                <form className="flex flex-row space-x-3">
                                    <select className="border fund-uses-dropdown" value={fundUseCategory} onChange={fundUseCategoryChangeHandler}>
                                        {useOfFundsArr?.map((useOfFundsArrItem) => (
                                            <option key={useOfFundsArrItem} value={useOfFundsArrItem}>
                                                {useOfFundsArrItem}
                                            </option>
                                        ))}
                                    </select>
                                    <input className="bg-primary-grey w-4/6 h-10 px-3 description-input" type="text" placeholder="Description" onChange={handleFundUseDescriptionChange}></input>

                                    <input className="bg-primary-grey w-2/6 h-10 px-3 amount-input" type="number" placeholder="Amount" onChange={handleFundUseAmountChange}></input>

                                    <button type="button" onClick={handleAddFundUse}><MdAddCircleOutline className="text-xl text-button-blue add-fund-button" /></button>
                                </form>

                                <ul>
                                    {fundUses?.map((fundUse) => (
                                        <div className="flex flex-row space-x-24 relative" key={fundUse.id}>
                                            <p className="left-0 grow">{fundUse.fundType}</p>
                                            <p className="left-1/4 grow">{fundUse.description}</p>
                                            <p className="left-1/2 grow">{fundUse.amount}</p>
                                            <button className="left-3/4 grow text-red-600" type="button" onClick={() => removeObjectWithId(fundUse.id)}>
                                                <BsFillTrash3Fill className="" />{fundUse.id}
                                            </button>
                                        </div>
                                    ))}
                                </ul>

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

                            <div className="border-t-2 border-gray-200 inline-block"></div>

                            <div className="flex flex-row">
                                <h2>Total Revenue Share</h2>
                                <span className="ml-auto">${totalRevenueShare}</span>
                            </div>

                            <div className="flex flex-row">
                                <h2>Expected transfers</h2>
                                <span className="ml-auto">{Math.ceil(expectedTransfers)}</span>
                            </div>

                            <div className="flex flex-row">
                                <h2>Expected completion date </h2>
                                <span className="ml-auto text-button-blue">{formattedDate}</span>
                            </div>

                            <div className="flex flex-row">
                                <h2>Expected APR</h2>
                                <span className="ml-auto">{Math.round(expectedAPR * 100) / 100}%</span>
                            </div>

                            <div>{expectedTransfersInDays}</div>
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