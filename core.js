
/*
 * Copyright (C) 2023 ohmyprogramming <github.com/ohmyprogramming>
 * html-table2csv
 * JavaScript Function to convert a HTMLTableElement to a CSV buffer
 * which can be then imported into other tools.
 */

/**
 * Convert HTMLTableElement to CSV
 * @param table     HTMLTableElement
 * @param separator Character to separate each cell (default ,)
 * @param callback  Callback function to call before sanitization (default none)
 * @param cb_order  Callback call order (0 = before innerText, 1 = after)
 * @return          String or Null
 */
function html_table2csv(
    table = null,
    separator = ',',
    callback = null,
    cb_order = 0
) {
    if ((table instanceof HTMLTableElement) === null)
        return null;

    /* Sanitize innerText */
    function sanitize(t) {
        /* Run callback before innerTetx */
        if (hascb && !cb_order)
            t = callback(t);

        var d = t.innerText.toString();
        var x = false;

        /* Run callback after innerText */
        if (hascb && cb_order)
            d = callback(d);

        if (d.includes('"')) {
            x = true;
            d = d.replace(/"/g, "\"\"");
        }

        if (d.includes(','))
            x = true;

        if (x) {
            d = "\"" + d + "\"";
        }

        return d;
    }

    var body = table.querySelector("tbody");
    var head = table.querySelector("thead");
    var hascb = callback instanceof Function;

    /* If head is null, try searching for heading in the body tag. */
    if (head == null)
        head = body.querySelector("tr th").parentElement ?? null;

    /* To write to a CSV buffer both |head| and |body| must not be null. */
    if (head === null ||
        body === null)
        return null;

    var csv_buffer = "";

    /* Build header */
    csv_buffer += Object.values(head.querySelectorAll(["th", "td"]))
                        .map(a => {
                            return sanitize(a);
                        }).join(separator) + "\n";

    /* Build body */
    csv_buffer += Object.values(body.querySelectorAll("tr"))
                        .map(a => {
                            return Object.values(a.querySelectorAll("td"))
                                         .map(b => {
                                            return sanitize(b);
                                         }).join(separator) + "\n";
                        }).join('');

    return csv_buffer;
}
