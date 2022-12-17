import React, { useState, useEffect } from "react";
import { Contract, providers, utils } from "ethers";
import {
  NFT_MARKETPLACE_ADDRESS,
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_ADDRESS,
  NFT_MARKETPLACE_ABI,
} from "../constants/index";
import axios from "axios";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Backgroundimg from "../public/assets/cta-shape-right.png";
import Backgroundimageleft from "../public/assets/cta-2-left.png";
import { useAccount, useConnect, useSigner, useProvider } from "wagmi";
import Image from "next/image";

function Homebanner() {
  const [nfts, setNfts] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const [loadingState, setLoadingState] = useState("not-loaded");

  //wagmi signer
  const { data: signer, isError } = useSigner();
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const provider = useProvider();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      provider
    );
    const marketplaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      NFT_MARKETPLACE_ABI,
      signer
    );
    try {
      const data = await marketplaceContract.getAllListedItems();
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await nftContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenURI);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            tokenURI,
          };
          return item;
        })
      );
      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }

  // const listAnItem = async () => {

  //   const nftContract = new Contract(
  //     NFT_CONTRACT_ADDRESS,
  //     NFT_CONTRACT_ABI,
  //     provider
  //   );

  //   const contract = new Contract(
  //     NFT_MARKETPLACE_ADDRESS,
  //     NFT_MARKETPLACE_ABI,
  //     provider
  //   );
  //      try {
  //        const data = await contract.getAllListedItems();

  //        const items = await Promise.all(
  //          data?.map(async (i) => {
  //            let price = utils.formatUnits(i.price.toString(), "ether");
  //            const tokenUri = await nftContract.tokenURI(i?.tokenId);
  //            const metaData = await axios.get(tokenUri);
  //            let item = {
  //              price,
  //              tokenId: i.tokenId.toNumber(),
  //              seller: i.seller,
  //              owner: i.owner,
  //              image: metaData.data.image,
  //              name: metaData.data.name,
  //              description: metaData.data.description,
  //            };
  //            return item;
  //          })
  //        );
  //        setNfts(items);
  //        setLoadingState("loaded");
  //      } catch (error) {
  //             console.log("Something went wrong", error);

  //      }

  //  };

  // async function loadNFTs() {
  //   /* create a generic provider and query for unsold market items */
  //   // const provider = new ethers.providers.JsonRpcProvider(
  //   //   "https://polygon-mumbai.g.alchemy.com/v2/vvDJmy7binUQorwIIY8CIjv-4N2Bx6CQ"
  //   // );

  //   const nftContract = new Contract(
  //     NFT_CONTRACT_ADDRESS,
  //     NFT_CONTRACT_ABI,
  //     provider
  //   );

  //   const contract = new Contract(
  //     NFT_MARKETPLACE_ADDRESS,
  //     NFT_MARKETPLACE_ABI,
  //     provider
  //   );
  //   const data = await contract.getAllListedItems();

  //   const items = await Promise.all(
  //     data?.map(async (i) => {
  //       let price = utils.formatUnits(i.price.toString(), "ether");
  //       const tokenUri = await nftContract.tokenURI(i?.tokenId);
  //       const metaData = await axios.get(tokenUri);
  //       let item = {
  //         price,
  //         tokenId: i.tokenId.toNumber(),
  //         seller: i.seller,
  //         owner: i.owner,
  //         image: metaData.data.image,
  //         name: metaData.data.name,
  //         description: metaData.data.description,
  //       };
  //       return item;
  //     })
  //   );
  //   setNfts(items);
  //   setLoadingState("loaded");
  // }

  const homeNft = nfts[1];

  if (homeNft != undefined) {
    console.log(homeNft.price);
  }
  console.log(nfts);

  // const buyNFT = async (price, tokenId) => {
  //   setIsPurchasing(true);

  //   const nftMarketPlaceContract = new Contract(
  //     NFT_MARKETPLACE_ADDRESS,
  //     NFT_MARKETPLACE_ABI,
  //     signer
  //   );

  //   let convertedPrice = utils.parseUnits(price.toString(), "ether");

  //   const transaction = await nftMarketPlaceContract.buyItem(
  //     NFT_CONTRACT_ADDRESS,
  //     tokenId,
  //     {
  //       value: convertedPrice,
  //     }
  //   );
  //   loadNFTs();
  //   await transaction.wait();
  //   await router.push("/my-items");
  //   setIsPurchasing(false);
  // };

  //connect wallet alert
  // useEffect(() => {
  //   connectWallet();
  // }, []);
  // const connectWallet = () => {
  //   if (typeof window !== "undefined") {
  //     alert("connect wallet");
  //   }
  // };

  const placeBid = () => {
    if (typeof window !== "undefined") {
      alert(" Function not availabe now. Try again later");
    }
  };

  // Gets the minted NFT data
  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          nftContractAddress,
          NFT.abi,
          signer
        );

        let tokenUri = await nftContract.tokenURI(tokenId);
        let data = await axios.get(tokenUri);
        let meta = data.data;

        setMiningStatus(1);
        setMintedNFT(meta.image);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setTxError(error.message);
    }
  };

  return (
    <div className="  first-section" id="Home" data-aos="fade-right">
      <div className="background_img">
        <img src={Backgroundimg.src} alt="Backgroundimg" />
      </div>

      <div className="background_img_left">
        <img src={Backgroundimageleft.src} alt="Backgroundimageleft" />
      </div>

      <div className="container rowX">
        <div className="col50 first-nft ">
          <h1 className="gather">
            Discover Digital Artworks & Collect <span>Best NFTs </span>{" "}
          </h1>
          <p>
            Get Started with the easiest and most secure platform to buy and
            trade digital ART and NFT&apos;s
          </p>
          <div className="explore">
            <button className="buy-btn ">
              <a href="/marketplace"> Explore More</a>
            </button>
          
          </div>
          <div className="first-counter">
            <h2 className="works">
              23 K+ <br /> <span>Art Work</span>
            </h2>
            <h2 className="works">
              20 K+ <br /> <span>Auction</span>
            </h2>
            <h2 className="works">
              8 K+ <br /> <span>Artist</span>
            </h2>
          </div>
        </div>
        <div className="col50 nfthead">
          <div className="bid gradient-box">
            <div>
              <Image
                src={homeNft?.image}
                alt="nft imaage"
                className="homenft_img"
              />
            </div>
            <div className="ending">
              <h5> {homeNft?.name}</h5>
              <h5> Hightest Bid</h5>
            </div>
            <div className="timer">
              <ul>
                <li id="days" />
                <li id="hours" />
                <li id="minutes" />
                <li id="seconds" />
              </ul>
              <p>{homeNft?.price} MATIC</p>
            </div>
            {/* <div className="bid-btn">
                  {!isConnected ? (
                    <button className="purchase-btn" onClick={connectWallet}>
                      Purchase
                    </button>
                  ) : (
                    <button
                      className="purchase-btn"
                      onClick={() =>
                        buyNFT(homeNft?.price.toString(), homeNft.tokenId)
                      }
                    >
                      {" "}
                      Purchase
                    </button>
                  )}
                  <button className="bids-btn" onClick={placeBid}>
                    {" "}
                    <a href="/#"> Place a bid</a>
                  </button>
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homebanner;