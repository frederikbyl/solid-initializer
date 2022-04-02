import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { buildThing, createSolidDataset, createThing, saveSolidDatasetAt, setThing } from '@inrupt/solid-client';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';
import { RDF, VCARD } from '@inrupt/vocab-common-rdf';
import { v4 } from 'uuid';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  session: any;
  name = '';
  city = '';
  street = '';
  houseNumber = '';
  gsm = '';
  dataLocation = 'private/address/'

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (getDefaultSession().info.isLoggedIn) {
      this.session = getDefaultSession();

    } else {
      this.router.navigate(['/login']);
    }
  }

  save() {
    console.log(this.name);
    console.log(this.city);
    console.log(this.street);
    console.log(this.houseNumber);
    console.log(this.gsm);
    console.log(this.dataLocation);
    let addressDataset = createSolidDataset();
    let myuuid = v4();

    const addressThing = buildThing(createThing({ name: myuuid }))
      .addUrl(RDF.type, "http://vito.be/contactGegevens")
      .addStringNoLocale("http://vito.be/naam", this.name)
      .addStringNoLocale("http://vito.be/straat", this.street)
      .addStringNoLocale("http://vito.be/huisNummer", this.houseNumber)
      .addStringNoLocale("http://vito.be/gsm", this.gsm)
      .build();
    addressDataset = setThing(addressDataset, addressThing);

    saveSolidDatasetAt(this.getRootName() + this.dataLocation + myuuid, addressDataset, {
      fetch: this.session.fetch
    }).then((result) => {
      console.log("Data created");
    });


  }

  saveAsVCARD() {
    //TODO: implement by Bram. I already imported the VCARD module from RDF lib.
    console.log("Saving as vcard");
    console.log(this.name);
    console.log(this.city);
    console.log(this.street);
    console.log(this.houseNumber);
    console.log(this.gsm);
    console.log(this.dataLocation);
    const uuid = v4();
    let addressDataset = createSolidDataset();

    const addressThing = buildThing(createThing({ name: uuid }))
      .addUrl(RDF.type, VCARD.Individual)
      .addStringNoLocale(VCARD.fn, this.name)
      .addStringNoLocale(VCARD.adr, this.street + " " + this.houseNumber)
      .addStringNoLocale(VCARD.locality, this.city)
      .addStringNoLocale(VCARD.tel, this.gsm)
      .build();
    addressDataset = setThing(addressDataset, addressThing);

    saveSolidDatasetAt(this.getRootName() + this.dataLocation + uuid, addressDataset, {
      fetch: this.session.fetch
    }).then((result) => {
      console.log("Data created");
      console.log(uuid);
    });
}

saveAsSchemaOrg() {
  //TODO: implement by Bram. I don't think there exists a module like vcard for this. You can write it as strings
}

getRootName() {
  if (getDefaultSession().info.isLoggedIn) {
    return getDefaultSession().info.webId!.replace('profile/card#me', '');
  } else {
    throw new Error("Not logged in");
  }
}
}
