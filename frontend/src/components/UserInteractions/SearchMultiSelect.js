import React, { useEffect, useState } from "react";
import Select from 'react-select';

export default function SearchMultiSelect({ initialGroupedItems, group, setGroup, chosenItems, setChosenItems, limit=null }) {
    const [groupedItems, setGroupedItems] = useState(
        Object.keys(initialGroupedItems).map((key, _) => {
            const currentGroup = initialGroupedItems[key].map(type => MakeOption(type, key));
            return {label: key, options: currentGroup};
        })
    ); 

    useEffect(() => {
        if(group) { 
            const groupOptions = initialGroupedItems[group].map(type => MakeOption(type, group));
            setGroupedItems([{label: group, options: groupOptions}]);
        } else {
            setGroupedItems(
                Object.keys(initialGroupedItems).map((key, _) => {
                    const currentGroup = initialGroupedItems[key].map(type => MakeOption(type, key));
                    return {label: key, options: currentGroup};
                })
            );
        }
    }, [group]);

    function MakeOption(t, g) {
        return {value: t, label: t, groupName: g};
    }

    function onItemsChange(e) {
        setChosenItems(e.map((dict, _) => { return dict["value"] }));

        if(e.length > 0) {
            setGroup(e[0]["groupName"]);
        } else {
            setGroup("");
        }
    }

    return (
        <div className="row-to-col-container">
            <Select
                className="multiselect-container"
                classNamePrefix="multiselect"
                isMulti 
                isClearable
                closeMenuOnSelect={ false }
                options={ groupedItems } 
                onChange={ e => onItemsChange(e) }
                isOptionDisabled={ () => limit ? chosenItems.length >= limit : false }
            />
        </div>
    );
}