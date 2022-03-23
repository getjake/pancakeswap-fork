const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers")

describe("Deploy Pancakeswap", () => {
  // local network provider
  const provider = ethers.provider;
  
  // Cake emission per block in Wei
  // const cakePerBlock = ethers.utils.parseEther('1').toNumber() // Same as the real network
  // const cakePerBlock = ethers.utils.formatEther('10').toNumber() // Same as the real network
  const cakePerBlock = 1;

  // 3 accounts
  let deployer;
  let user1;
  let user2;

  // WETH Contract
  let _wethContract;
  let wethContract;
  let wethAddress;
  
  // Cake Token
  let _cakeTokenContract;
  let cakeTokenContract;
  let cakeTokenAddress;

  // Syrup Token
  let _syrupTokenContract;
  let syrupTokenContract;
  let syrupTokenAddress;

  // pancake factory contract
  let _pancakeFactoryContract;
  let pancakeFactoryContract;
  let pancakeFactoryAddress;

  // pancake router contract
  let _pancakeRouterContract;
  let pancakeRouterContract;
  let pancakeRouterAddress;

  // pancake masterchef contract
  let _pancakeMasterchefContract;
  let pancakeMasterchefContract;
  let pancakeMasterchefAddress;

  it("deploys the pancakeswap contract", async () => {
    [deployer, user1, user2] = await ethers.getSigners();

    // deploy Cake Token
    _cakeTokenContract = await ethers.getContractFactory("CakeToken");
    cakeTokenContract = await _cakeTokenContract.deploy();
    cakeTokenAddress = cakeTokenContract.address;
    console.log("Cake Token Address: ", cakeTokenAddress);
    
    // deploy Syrup Token
    _syrupTokenContract = await ethers.getContractFactory("SyrupBar");
    syrupTokenContract = await _syrupTokenContract.deploy(cakeTokenAddress);
    syrupTokenAddress = syrupTokenContract.address;
    console.log("SyrupBar Address: ", syrupTokenAddress);

    // deploy WETH contract
    _wethContract = await ethers.getContractFactory("WETH");
    wethContract = await _wethContract.deploy();
    wethAddress = wethContract.address;
    console.log("WETH Contract Address: " + wethAddress);

    // deploy pancake factory
    _pancakeFactoryContract = await ethers.getContractFactory("PancakeFactory");
    pancakeFactoryContract = await _pancakeFactoryContract.deploy(deployer.address); // feeTo Address -> deployer
    pancakeFactoryAddress = pancakeFactoryContract.address;
    console.log("PancakeFactory deployed to:", pancakeFactoryAddress);

    // deploy pancake router
    _pancakeRouterContract = await ethers.getContractFactory("PancakeRouter");
    pancakeRouterContract = await _pancakeRouterContract.deploy(pancakeFactoryAddress, wethAddress);
    pancakeRouterAddress = pancakeRouterContract.address;
    console.log("PancakeRouter deployed to:", pancakeRouterAddress);

    // deploy pancake masterchef
    _pancakeMasterchefContract = await ethers.getContractFactory("MasterChef");
    const currentBlock = await provider.getBlock('latest')
    pancakeMasterchefContract = await _pancakeMasterchefContract.deploy(cakeTokenAddress, syrupTokenAddress, deployer.address, cakePerBlock, (currentBlock + 10) );
    console.log("PancakeMasterchef deployed to:", pancakeMasterchefContract.address);
  });
});
