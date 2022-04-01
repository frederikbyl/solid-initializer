import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { getSolidDatasetWithAcl, hasAccessibleAcl, hasFallbackAcl, hasResourceAcl, saveAclFor, createAclFromFallbackAcl, getResourceAcl, setAgentResourceAccess, setAgentDefaultAccess } from '@inrupt/solid-client';
import { getDefaultSession } from '@inrupt/solid-client-authn-browser';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {
  session: any;
  targetWebId='';
  uri='';
  error='';
  success='';

  form: FormGroup;
  authorizations: Array<any> = [
    { name: 'Read', value: 'read' },
    { name: 'Write', value: 'write' },
    { name: 'Append', value: 'append' },
    { name: 'Control', value: 'control' }
  ];

  constructor(private router: Router, fb: FormBuilder) { 
    this.form = fb.group({
      selectedAuthorizations:  new FormArray([])
     });
  }

  ngOnInit(): void {
    if (getDefaultSession().info.isLoggedIn) {
      this.session = getDefaultSession();
   
    } else {
      this.router.navigate(['/login']);
    }
  }

  onCheckboxChange(event: any) {
    const selectedAuthorizations = (this.form.controls['selectedAuthorizations'] as FormArray);
    if (event.target.checked) {
      selectedAuthorizations.push(new FormControl(event.target.value));
    } else {
      const index = selectedAuthorizations.controls
      .findIndex(x => x.value === event.target.value);
      selectedAuthorizations.removeAt(index);
    }
  }

  authorize() {
   // console.log(this.form.value);
   this.error='';
   this.success='';
   let authorizations:any={};
    for(const authorization of this.form.value.selectedAuthorizations) {
      console.log(authorization);
      authorizations[authorization] = true;
    }
    console.log(authorizations)
    console.log(this.targetWebId);
    console.log(this.uri);

    this.shareFolder(this.targetWebId, this.uri, authorizations).then((result)=>{this.success="DONE";}).catch((error)=>{
      console.error("ERROR WHEN SETTING RIGHTS: "+error);
      this.error=error;
    });


  }

  async shareFolder(agent: string, location: string, authorizations: any) {
    if (this.session.info.isLoggedIn) {

      const myDatasetWithAcl = await getSolidDatasetWithAcl(location, { fetch: this.session.fetch })
      let usesAcl = hasAccessibleAcl(myDatasetWithAcl);
      let resourceAcl;
      if (!hasResourceAcl(myDatasetWithAcl)) {
        console.log("hasResourceAcl");
        if (!hasAccessibleAcl(myDatasetWithAcl)) {
          console.log("error 1");
          throw new Error(
            "The current user does not have permission to change access rights to this Resource."
          );
        }
        if (!hasFallbackAcl(myDatasetWithAcl)) {
          console.log("error 2");
          throw new Error(
            "The current user does not have permission to see who currently has access to this Resource."
          );
        }
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);

      } else {
        resourceAcl = getResourceAcl(myDatasetWithAcl);
      }

      // Give someone Control access to the given Resource:
      let updatedAcl = setAgentResourceAccess(
        resourceAcl,
        agent,
        authorizations
      )
      updatedAcl = setAgentDefaultAccess(
        updatedAcl,
        agent,
        authorizations
      )
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: this.session.fetch });

    }

  }

}
