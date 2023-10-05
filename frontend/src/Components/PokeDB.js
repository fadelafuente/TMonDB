import '../App.css';
import firebase from "../firebase";
import { useEffect, useState } from 'react';
import React from 'react'

function PokeDB() {
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = firebase.firestore().collection("test-collection");

  // Grab items in test-collection
  function getTest() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setNames(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getTest();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="screen">

      <section className="body">
        <h1>Pokemon DB</h1><br/>

        {/* return the tag containing data from Firestore. */}
        {
          names.map((name) => (
            <div key={name.id}>
              <h2>Name: {name.name}</h2>
              <p>Description: {name.desc}</p>
            </div>
          ))
        }
      </section>
    </div>
  );
}

export default PokeDB;