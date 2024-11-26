document.getElementById("generate-pdf").addEventListener("click", () => {
  console.log("Generazione PDF avviata...");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Colore per "PREVENTIVO"
  const titleColor = [0, 51, 102]; // Blu
  const blackColor = [0, 0, 0]; // Nero

  // Sposta tutto leggermente più in basso
  let yStart = 20; // Altezza iniziale dinamica

  // Aggiungi il logo
  const logo = new Image();
  logo.src = "logo.png";
  logo.onload = () => {
    doc.addImage(logo, "PNG", 150, yStart, 40, 40); // Logo in alto a destra
    yStart += 10; // Spazio extra dopo il logo

    // Aggiungi la scritta "PREVENTIVO" in blu
    doc.setTextColor(...titleColor);
    doc.setFontSize(24);
    doc.text("PREVENTIVO", 10, yStart); // Scritta blu
    yStart += 15; // Sposta tutto più in basso dopo "PREVENTIVO"

    // Dati cliente in nero
    doc.setTextColor(...blackColor);
    doc.setFontSize(12);

    const clientName = document.getElementById("name").value || "N/A";
    const clientSurname = document.getElementById("surname").value || "N/A";
    const clientPhone = document.getElementById("phone").value || "N/A";
    const clientEmail = document.getElementById("email").value || "N/A";
    const clientAddress = document.getElementById("address").value || "N/A";

    doc.text(`Cliente: ${clientName} ${clientSurname}`, 10, yStart);
    doc.text(`Telefono: ${clientPhone}`, 10, yStart + 10);
    doc.text(`Email: ${clientEmail}`, 10, yStart + 20);
    doc.text(`Indirizzo: ${clientAddress}`, 10, yStart + 30);

    yStart += 40; // Sposta tutto più in basso dopo i dati cliente

    // Prima linea di separazione (chiara)
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200); // Colore grigio chiaro
    doc.line(10, yStart, 200, yStart);
    yStart += 10; // Spazio dopo la linea

    // Aggiungi i prodotti
    const products = Array.from(document.querySelectorAll("#product-table tbody tr")).map((row) => {
      const cells = row.querySelectorAll("td");
      return [
        cells[0]?.textContent.trim(),
        cells[1]?.textContent.trim(),
        cells[2]?.textContent.trim(),
        cells[3]?.textContent.trim(),
      ];
    });

    doc.autoTable({
      head: [["Qtà", "Descrizione", "Prezzo Unitario (€)", "Totale (€)"]],
      body: products,
      startY: yStart,
      theme: "grid",
      headStyles: {
        fillColor: [0, 51, 102], // Colore della tabella (blu)
        textColor: [255, 255, 255], // Colore del testo (bianco)
        fontStyle: "bold",
      },
    });

    yStart = doc.lastAutoTable.finalY + 10; // Posiziona dopo la tabella prodotti

    // Totali
    doc.text(`Subtotale: €${document.getElementById("subtotal").textContent || "0.00"}`, 10, yStart);
    doc.text(`IVA (22%): €${document.getElementById("vat").textContent || "0.00"}`, 10, yStart + 10);
    doc.text(`Sconto: €${document.getElementById("discount").value || "0.00"}`, 10, yStart + 20);
    doc.text(`Totale: €${document.getElementById("total").textContent || "0.00"}`, 10, yStart + 30);

    // Seconda linea di separazione finale (chiara)
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200); // Stesso colore della prima linea
    doc.line(10, yStart + 40, 200, yStart + 40);
    yStart += 50;

    // Testo finale
    doc.setFontSize(10);
    const finalMessage =
      "I preventivi sono compresi di Iva e montaggio. Rimango a disposizione per qualsiasi chiarimento. Grazie\n\nCordiali saluti\nStefano";
    const lines = doc.splitTextToSize(finalMessage, 180); // Larghezza massima del testo
    doc.text(lines, 10, yStart);
    yStart += lines.length * 5; // Sposta in basso in base al numero di righe

    // Informazioni aziendali in basso a sinistra
    const footerInfo = `Via XX Settembre, 12
20081 Abbiategrasso (MI)
Tel. 02.94969152
Cell. 346.2138048
P.I. 11522420964
Codice SDI N9KM26R`;
    const footerLines = doc.splitTextToSize(footerInfo, 70); // Dividi il testo in base alla larghezza massima
    const pageHeight = doc.internal.pageSize.height;

    const footerStartY = pageHeight - footerLines.length * 5 - 10; // Calcola la posizione del footer
    doc.text(footerLines, 10, footerStartY); // Posiziona il footer in basso a sinistra

    doc.save("preventivo.pdf");
    console.log("PDF generato e salvato.");
  };
});
