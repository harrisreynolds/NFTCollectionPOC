// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MintableERC721.sol";

contract WeBaseCollectionFactory {
    MintableERC721[] children;

    event NFTContractCreated(address nftContractAddress);

    function deploy721Contract(
        string calldata name,
        string calldata symbol
    ) external returns (MintableERC721 collectionAddress) {

        MintableERC721 newCollection = new MintableERC721(name, symbol);
        children.push(newCollection);
        emit NFTContractCreated(address(newCollection));
        return newCollection;
    }
}
