function createDownloadButton(el, table) {
  const container = document.createElement("div");
  container.id = "download-data";
  container.style.padding = "10px";
  const button = document.createElement("button");
  button.textContent = "Download";
  button.addEventListener("click", () => {
    table.download("csv", "data.csv");
  });
  container.appendChild(button);
  el.before(container);
}

class TabulatorOutputBinding extends Shiny.OutputBinding {
  find(scope) {
    return scope.find(".shiny-tabulator-output");
  }

  renderValue(el, payload) {
    console.log("payload", payload);
    // el.style.background = "lightgreen";
    const editable =
      payload.options !== undefined ? payload.options.editor : false;

    // const editable = false;
    // const options = payload.options | {};
    let columnsDef = payload.schema.fields.map((item) => {
      return {
        title: item.name,
        field: item.name,
        hozAlign: ["integer", "number"].includes(item.type) ? "right" : "left",
        editor: editable,
      };
    });

    if (payload.options.movableRows === true) {
      columnsDef = [
        {
          rowHandle: true,
          formatter: "handle",
          headerSort: false,
          frozen: true,
          width: 30,
          minWidth: 30,
        },
      ].concat(columnsDef);
    }

    if (payload.options.download) {
      payload.options.footerElement =
        "<button id='tabulator-download-csv' class='tabulator-page'>Download csv</button>";
    }

    const table = new Tabulator(
      el,
      Object.assign(
        {
          // height: 205,
          data: payload.data,
          layout: "fitColumns",
          columns: columnsDef,
        },
        payload.options,
      ),
    );

    table.on("rowClick", function (e, row) {
      const inputName = `${el.id}_row`;
      console.log(inputName, row.getData());
      Shiny.onInputChange(inputName, row.getData());
    });

    table.on("cellEdited", function (cell) {
      console.log("cell edited", cell.getData());
    });

    table.on("tableBuilt", function () {
      const downloadButton = document.getElementById("tabulator-download-csv");
      if (downloadButton) {
        downloadButton.addEventListener("click", () =>
          table.download("csv", "data.csv"),
        );
      }
    });
  }
}

// Register the binding
Shiny.outputBindings.register(
  new TabulatorOutputBinding(),
  "shiny-tabulator-output",
);
