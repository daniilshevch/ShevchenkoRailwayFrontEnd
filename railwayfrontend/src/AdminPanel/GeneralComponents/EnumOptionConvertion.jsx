import React from "react";

const enumOptions = (enumObj) =>
    Object.entries(enumObj).map(([key, value]) => (
        <Option key={key} value={parseInt(key)}>
            {value}
        </Option>
    ));

const enumOptionsForStrings = (enumObj) =>
    Object.entries(enumObj).map(([key, value]) => (
        <Option key={key} value={key}>
            {value}
        </Option>
    ));

export {enumOptions, enumOptionsForStrings};