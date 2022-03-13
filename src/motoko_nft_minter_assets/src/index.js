import { Actor, HttpAgent } from "@dfinity/agent";
// The minter is the representation of the minter contract in main.mo but in JavaScript
import { motoko_nft_minter } from "../../declarations/motoko_nft_minter";

// This is library to use with principal that is provided by Dfinity
import { Principal } from "@dfinity/principal";
import { StoicIdentity } from "ic-stoic-identity";

document.getElementById("wallet_2").style.display = "none";
document.getElementById("connectStoic").style.display = "block";
document.getElementById("plugw").style.display = "block";
document.getElementById("plug_logout").style.display = "none";
// document.getElementById("showNFT").style.display = "none";
// window.ic.plug.requestConnect()

const reg_wallet = document.getElementById("connectStoic");
reg_wallet.addEventListener("click", async () => {
  StoicIdentity.load().then(async (identity) => {
    if (identity !== false) {
      //ID is a already connected wallet!
      document.getElementById("plug_logout").style.display = "none";
      document.getElementById("plugw").style.display = "none";
      document.getElementById("wallet_2").style.display = "block";
      document.getElementById("connectStoic").style.display = "none";
      
      // document.getElementById("showNFT").style.display = "block";

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Connected successfully",
      });
    } else {
      //No existing connection, lets make one!
      identity = await StoicIdentity.connect();
      document.getElementById("connectStoic").style.display = "block";
      document.getElementById("wallet_2").style.display = "none";
      // document.getElementById("showNFT").style.display = "none";
      document.getElementById("plug_logout").style.display = "none";
      document.getElementById("plugw").style.display = "none";
    }

    //Lets display the connected principal!
    // console.log(identity.getPrincipal().toText());

    const my_wal = document.getElementById("principal");
    my_wal.value = await identity.getPrincipal().toText();

    //Create an actor canister
    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({
        identity,
      }),
      canisterId,
    });

    //Disconnect after
    StoicIdentity.disconnect();
  });
});

// s7cxu-sikor-uwiaa-aaaaa-b4aay-eaqca-aaazj-a
// let shutoff = StoicIdentity.disconnect();
const logout = document.getElementById("wallet_2");
logout.addEventListener("click", async () => {
  Swal.fire({
    title: "Log out?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#198754 !important;",
    cancelButtonColor: "#d33",
    confirmButtonText: "Wallet Disconnected!",
  }).then((result) => {
    if (result.isConfirmed) {
      StoicIdentity.load().then(async (identity) => {
        //Disconnected ID wallet!

        // identity = await StoicIdentity.disconnect();
        document.getElementById("connectStoic").style.display = "block";
        document.getElementById("plugw").style.display = "block";
        document.getElementById("wallet_2").style.display = "none";
        // document.getElementById("showNFT").style.display = "none";
        document.getElementById("principal").value = "";
      });
      Swal.fire("Logged Out!", "You have successfully logged out", "success");
    }
  });
});

// For beginners : This is really basic Javascript code that add an event to the "Mint" button so that the mint_nft function is called when the button is clicked.
const mint_button = document.getElementById("mint");
mint_button.addEventListener("click", mint_nft);
let nft_arrays = [];

async function mint_nft() {
  // Get the principal from the input field.
  const principal_string = document
    .getElementById("principal")
    .value.toString();
  const name = document.getElementById("name").value.toString();
  const principal = Principal.fromText(principal_string);

  const mintId = await motoko_nft_minter.mint_principal(name, principal);
  document.getElementById("nft").src = await motoko_nft_minter.tokenURI(mintId);

  // document.getElementById("nft").src = await minter.tokenURI(mintId);

  let timerInterval;
  Swal.fire({
    title: "Minting!",
    html: "Processing... <b></b> milliseconds.",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("b");
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    // Get the url of the image from the input field
    const name = document.getElementById("name").value.toString();
    console.log("The url we are trying to mint is - " + name);
    document.getElementById("minting_info").innerHTML =
      "The url we are trying to mint is - " + name;

    document.getElementById("greeting").innerText =
      "This nft owner is: " +
      principal_string +
      "\nand the token ID is " +
      Number(mintId);
    Swal.fire("NFT Minted!", "", "success");
  });

  var counter = 0;
  let nft_array = {
    id: "",
    url: ""
  };
  let imgx = "";

  // let nft_gallery = document.getElementById("img_gallary");

  if (counter >= 0) {
    
    for (var i = 0; i <= 1; i++) {
      nft_array.id = mintId;
      nft_array.url = name;
      counter++;
    }

    nft_arrays.push(nft_array);
    // imgx = nft_arrays[0].url;
    
  }

    var nft_single_image = new Image();
    nft_single_image.src = nft_arrays[0].url;

    document.getElementById("img_gallary").append(nft_single_image);
    var nx = document.getElementById("img_gallary"); 
    nx.classList.add("w-100", "shadow-1-strong","rounded","mb-4");
  
  // imgx = nft_arrays[0].url;
  // document.getElementById("my_minted_nft_img").src = imgx;
  // console.log(imgx);
  console.log(nft_arrays.length);
  console.log(nft_arrays);

  // imgx = document.getElementById("my_minted_nft_img").src = nft_array.name;
}

const verifyConnection = async () => {
  const connected = await window.ic.plug.isConnected();

  if (!connected) await window.ic.plug.requestConnect({ whitelist, host });
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: "Connected successfully",
  });

  console.log(`Plug connection is ${connected}`);
  document.getElementById("wallet_2").style.display = "none";
    document.getElementById("connectStoic").style.display = "none";
    document.getElementById("plugw").style.display = "none";
    document.getElementById("plug_logout").style.display = "block";

  


  if (connected && !window.ic.plug.agent) {
    window.ic.plug.createAgent({ whitelist, host });
  }
  // const bal = await window.ic.plug.requestBalance();
  // console.log("User account balance: ", bal);
};

// useEffect(async () => {
//   verifyConnection();
// }, []);

const plug_wallet_con = document.getElementById("plugw");
plug_wallet_con.addEventListener("click", async () => {
  // console.log("Button Clicked");

  // Canister Ids
  const nnsCanisterId = "qoctq-giaaa-aaaaa-aaaea-cai";

  // Whitelist
  const whitelist = [nnsCanisterId];

  // Host
  const host = "https://mainnet.dfinity.network";

  // Make the request
  try {
    const publicKey = await window.ic.plug.requestConnect({
      whitelist,
      host,
    });
    console.log(`The connected user's public key is:`, publicKey);
  } catch (e) {
    console.log(e);
  }

  verifyConnection();

  // A partial Interface factory
  // for the NNS Canister UI
  // Check the `plug authentication - nns` for more
  const nnsPartialInterfaceFactory = ({ IDL }) => {
    const BlockHeight = IDL.Nat64;
    const Stats = IDL.Record({
      latest_transaction_block_height: BlockHeight,
      seconds_since_last_ledger_sync: IDL.Nat64,
      sub_accounts_count: IDL.Nat64,
      hardware_wallet_accounts_count: IDL.Nat64,
      accounts_count: IDL.Nat64,
      earliest_transaction_block_height: BlockHeight,
      transactions_count: IDL.Nat64,
      block_height_synced_up_to: IDL.Opt(IDL.Nat64),
      latest_transaction_timestamp_nanos: IDL.Nat64,
      earliest_transaction_timestamp_nanos: IDL.Nat64,
    });
    return IDL.Service({
      get_stats: IDL.Func([], [Stats], ["query"]),
    });
  };

  // Create an actor to interact with the NNS Canister
  // we pass the NNS Canister id and the interface factory
  // const NNSUiActor = await window.ic.plug.createActor({
  //   canisterId: nnsCanisterId,
  //   interfaceFactory: nnsPartialInterfaceFactory,
  // });

  // We can use any method described in the Candid (IDL)
  // for example the get_stats()
  // See https://github.com/dfinity/nns-dapp/blob/cd755b8/canisters/nns_ui/nns_ui.did
  // const stats = await NNSUiActor.get_stats();
  // console.log('NNS stats', stats);

  // Get the user principal id
  const principal_string = document.getElementById("principal");

  const principalId = await window.ic.plug.agent.getPrincipal();

  console.log(`Plug's user principal Id is ${principalId}`);
  principal_string.value = principalId;

  // const principal_string = principal_text_id.toString();

  const principal = Principal.fromText(principal_string);
  const name = document.getElementById("name").value.toString();

  const mintId = await motoko_nft_minter.mint_principal(name, principal);

  document.getElementById("nft").src = await motoko_nft_minter.tokenURI(mintId);
});

var plug_logout = document.getElementById("plug_logout");
plug_logout.addEventListener("click", async () => {
  Swal.fire({
    title: "Log out?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#198754 !important;",
    cancelButtonColor: "#d33",
    confirmButtonText: "Wallet Disconnected!",
  }).then((result) => {
    if (result.isConfirmed) {
      
      setTimeout (() => { Swal.fire("Logged Out!", "You have successfully logged out", "success");}, 2000);
      location.reload();
      // location.reload();
    }
    
    
  });
})