(() => {
  // srcjs/index.js
  var TabulatorOutputBinding = class extends Shiny.OutputBinding {
    find(scope) {
      return scope.find(".shiny-tabulator-output");
    }
    renderValue(el, payload) {
      console.log("payload", payload);
      const editable = payload.options !== void 0 ? payload.options.editor : false;
      let columnsDef = payload.schema.fields.map((item) => {
        return {
          title: item.name,
          field: item.name,
          hozAlign: ["integer", "number"].includes(item.type) ? "right" : "left",
          editor: editable
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
            minWidth: 30
          }
        ].concat(columnsDef);
      }
      if (payload.options.download) {
        payload.options.footerElement = "<button id='tabulator-download-csv' class='tabulator-page'>Download csv</button>";
      }
      const table = new Tabulator(
        el,
        Object.assign(
          {
            // height: 205,
            data: payload.data,
            layout: "fitColumns",
            columns: columnsDef
          },
          payload.options
        )
      );
      table.on("rowClick", function(e, row) {
        const inputName = `${el.id}_row`;
        console.log(inputName, row.getData());
        Shiny.onInputChange(inputName, row.getData());
      });
      table.on("cellEdited", function(cell) {
        console.log("cell edited", cell.getData());
      });
      table.on("tableBuilt", function() {
        const downloadButton = document.getElementById("tabulator-download-csv");
        if (downloadButton) {
          downloadButton.addEventListener(
            "click",
            () => table.download("csv", "data.csv")
          );
        }
      });
    }
  };
  Shiny.outputBindings.register(
    new TabulatorOutputBinding(),
    "shiny-tabulator-output"
  );
})();
