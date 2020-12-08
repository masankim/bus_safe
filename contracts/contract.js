const address = "0xd017f58ebb582F78C6f0EFDC00e4353B0319da9B"

const abi =[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "checker",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "car_id",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "check_res",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "check_etc",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "check_time",
          "type": "uint64"
        }
      ],
      "name": "AddCheck",
      "type": "event"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "checks",
      "outputs": [
        {
          "internalType": "address",
          "name": "checker",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "car_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "check_res",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "check_etc",
          "type": "string"
        },
        {
          "internalType": "uint64",
          "name": "check_time",
          "type": "uint64"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "_car_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_check_res",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_check_etc",
          "type": "string"
        },
        {
          "internalType": "uint64",
          "name": "_check_time",
          "type": "uint64"
        }
      ],
      "name": "AddCheckList",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "TotalCount",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_index",
          "type": "uint256"
        }
      ],
      "name": "GetCheck",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]
  module.exports={address , abi}