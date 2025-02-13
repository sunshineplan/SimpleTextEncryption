<script lang="ts">
  import Swal from "sweetalert2";
  import * as ste from "./ste";

  let plaintext = $state("");
  let ciphertext = $state("");
  let key = $state("");
  let show = $state(false);
  let selected = $state("ciphertext");

  const popup = Swal.mixin({
    customClass: { confirmButton: "swal btn btn-primary" },
    buttonsStyling: false,
  });

  const encrypt = async () => {
    if (!plaintext) {
      await popup.fire("Error", "Empty plaintext!", "error");
      return;
    }
    if (!key) {
      const confirm = await Swal.fire({
        title: "Warning!",
        text: "No key provided, only encode using base64.",
        icon: "warning",
        confirmButtonText: "Continue",
        showCancelButton: true,
        customClass: {
          confirmButton: "swal btn btn-primary",
          cancelButton: "swal btn btn-danger",
        },
        buttonsStyling: false,
      });
      if (!confirm.value) return;
    }
    ciphertext = await ste.encrypt(key, plaintext);
    const textarea = document.querySelector("div.encrypted>textarea");
    if (textarea) textarea.scrollTop = 0;
  };

  const decrypt = async () => {
    if (!ciphertext) {
      await popup.fire("Error", "Empty ciphertext!", "error");
      return;
    }
    try {
      plaintext = await ste.decrypt(key, ciphertext);
      const textarea = document.querySelector("div.unencrypted>textarea");
      if (textarea) textarea.scrollTop = 0;
    } catch (e) {
      let message = "Unknow Error";
      if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      await popup.fire(
        "Error",
        "Incorrect key or malformed encrypted text!<br><br>" + message,
        "error",
      );
    }
  };

  const copy = async () => {
    let result: string;
    if (selected == "ciphertext") result = ciphertext;
    else result = plaintext;
    result = result.trim();
    if (result)
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(result);
        await popup.fire(
          "Success",
          "Text has been copied to clipboard.",
          "success",
        );
      } else
        await popup.fire(
          "Error",
          "This function requires a secure origin. (HTTPS or localhost)",
          "error",
        );
  };
</script>

<header class="navbar navbar-expand navbar-light flex-column flex-md-row">
  <a class="navbar-brand text-primary m-0 mr-md-3" href="/">
    Simple Text Encryption
  </a>
</header>
<div class="container-fluid">
  <div class="row">
    <div class="unencrypted">
      <textarea
        class="form-control"
        bind:value={plaintext}
        placeholder="Type (or paste) plaintext here..."
      ></textarea>
    </div>
    <div class="btnbar">
      <div class="button-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Key</span>
          </div>
          <input
            type={show ? "text" : "password"}
            class="form-control"
            maxlength="1000"
            oninput={(e) => {
              if (e.target) key = e.currentTarget.value;
            }}
          />
        </div>
        <div class="custom-control custom-checkbox mb-3">
          <input
            type="checkbox"
            class="custom-control-input"
            bind:checked={show}
            id="show"
          />
          <label class="custom-control-label" for="show">Show/Hide Key</label>
        </div>
      </div>
      <div class="button-group main">
        <button
          onclick={encrypt}
          class="btn btn-danger btn-block"
          type="button"
          id="encrypt"
        >
          <span class="horizontal">
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z"
              />
            </svg>
            Encrypt
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z"
              />
            </svg>
          </span>
          <span class="vertical">
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"
              />
            </svg>
            Encrypt
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"
              />
            </svg>
          </span>
        </button>
        <button
          onclick={decrypt}
          class="btn btn-success btn-block"
          type="button"
          id="decrypt"
        >
          <span class="horizontal">
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 00-1.659-.753l-5.48 4.796a1 1 0 000 1.506z"
              />
            </svg>
            Decrypt
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 00-1.659-.753l-5.48 4.796a1 1 0 000 1.506z"
              />
            </svg>
          </span>
          <span class="vertical">
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 00.753-1.659l-4.796-5.48a1 1 0 00-1.506 0z"
              />
            </svg>
            Decrypt
            <svg width="1em" height="1em" fill="currentColor">
              <path
                d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 00.753-1.659l-4.796-5.48a1 1 0 00-1.506 0z"
              />
            </svg>
          </span>
        </button>
      </div>
      <div class="button-group copy">
        <br />
        <button
          onclick={copy}
          type="button"
          class="btn btn-primary btn-block"
          id="copy"
        >
          Copy to clipboard
        </button>
        <div class="d-flex justify-content-around">
          <div class="custom-control custom-radio custom-control-inline">
            <input
              class="custom-control-input"
              type="radio"
              id="plaintext"
              bind:group={selected}
              value="plaintext"
            />
            <label class="custom-control-label" for="plaintext">
              Plaintext
            </label>
          </div>
          <div class="custom-control custom-radio custom-control-inline">
            <input
              class="custom-control-input"
              type="radio"
              id="ciphertext"
              bind:group={selected}
              value="ciphertext"
            />
            <label class="custom-control-label" for="ciphertext">
              Ciphertext
            </label>
          </div>
        </div>
        <br />
      </div>
      <div class="button-group">
        <button
          onclick={() => {
            plaintext = "";
            ciphertext = "";
          }}
          type="button"
          class="btn btn-primary btn-block"
        >
          Clear
        </button>
      </div>
    </div>
    <div class="encrypted">
      <textarea
        class="form-control"
        bind:value={ciphertext}
        placeholder="Paste ciphertext here..."
      ></textarea>
    </div>
  </div>
</div>
