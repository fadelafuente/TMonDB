import '../App.css';
import firebase from "../firebase";
import { useEffect, useState } from 'react';
import React from 'react';

function RegionList() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = firebase.firestore().collection("Regions");

  // Grab items in test-collection

  useEffect(() => {
    function getRegions() {
      setLoading(true);
      ref.onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        setRegions(items);
        setLoading(false);
      });
    }
    
    getRegions();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
      <optgroup label="Regions">

        {/* return the tag containing data from Firestore. */}
        {
          regions.map((region) => (
            <option key={region.id}>{region.name}</option>
          ))
        }
      </optgroup>
  );
}

export default RegionList;