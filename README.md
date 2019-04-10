# FR05J

This Angular client application is a thin client app, used for testing.

- It is a small Angular app which is intended to be served by a Delphi FR desktop application.
- It will connect back to the Delphi app.
- From within the Angular app you can send race-timing data to the Delphi app.
- The Angular client app can also show a table with current data, coming back from the Delphi app.
- This is how you get good feedback during testing.

Fat client Angular apps that connect to the Delphi app are also available, see FR03A1 or FR03E1.

I have the original project on my Windows machine in directory D:\Angular\FR05J .

So on Windows you may want to git clone into a directory named FR05J, all caps, but this is just a suggestion.
It will matter if you configure the path to the dist folder in the Delphi app, there are defaults.

### fleet-race-angular-client

You need to build with a base-href of /frac/ which is hardcoded in the Delphi app.

Use the *build-fr* definition in package.json like so:
```
npm run build-fr
```

You could build a bunch of slightly different client apps, all using frac as base-href, and then point the Delphi app at one of those.
FR05J is one step in my attempt to build a ligth weight Angulare timing app for FR.

### How to configure the Delphi app

Tested with FR69 from the sibling fleetrace-delphi repo.
You need to tell the Delphi desktop app where the Angular app is located, so that it can be served on request from a browser.

- Use a Delphi application which was built with the *AngularWeb* feature.
- Start it up at least once to create a new configuration file.
- Find the configuration file, the ini-file.
- Close the Delphi application and edit the ini-file.
- Specify the path to the dist folder where you have created the Angular app.
- Or the path where you have put the Angular app.
- The next time you start the Delphi app it should be able to serve FR05J.

### How to see FR05J in a browser

- Start up the Delphi app on Windows.
- Browse to the home page of the web server that is built into the Delphi app.
- There you will find an *Angular* link.
- On the page that is shown you will find a link to *FRAC* .
- This will call up /frac/index.html .
- You should see the Angular app loading.

Of course you can just open Chrome and surf directly to something like

```
http://localhost:8086/Angular/Index
http://localhost:8086/frac/index.html
```

The Delphi app will tell you what the Url is.
You could run the Delphi app in a virtual machine in the cloud.
I have done that many years ago.
But here I assume you will do so locally, for testing purposes.

### Status

Hey, I need to put this project on github so that I do not loose it.

It is considered work in progress, though I am not currently working on it.

Use it for testing within your local area network. There is no authentication, no authorization.

I have done similar thin client applications for FR in the past using other technology.
Usually you would send timing messages via tcp, from a desktop client program.

This Angular app can show you what has been possible in the past,
what is still possible,
how it is intended,
and what should perhaps (please) be working the same way in the future. 

In order to build something modern which can be used with the devices,
you may want to start here.

Next up, you could try to morph this into something that is fun to use on a phone (layout).

I guess I will continue to maintain the Delphi server app, while the *community* may do care more about the client apps,
both fat client apps and thin client apps.

The server can be thin or fat too. FR69 is a super fat server app written in Delphi.
But Asp.Net could be used.