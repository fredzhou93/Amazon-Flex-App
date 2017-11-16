let packageList = [{
  "name": "package1",
  "startLocation": "Locker1",
  "endLocation": "Locker2"
}, {
  "name": "package2",
  "startLocation": "Locker4",
  "endLocation": "Locker5"
}]

let startLockerList = ["Locker1", "Locker3", "Locker5"]
let endLockerList = ["Locker2", "Locker4", "Locker6"]

function checkPakcage(startLockerList, endLockerList) {
  let okPackageList = [];
  packageList.forEach((package) => {
    if (startLockerList.contains(package.startLocation) && endLockerList.contains(package.endLocation)) {
      okPackageList.push(package);
    }
  });
  console.log(okPackageList);
}


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>
        <script type="text/javascript">
            var geocoder;
            var map;

            function initialize() {
                geocoder = new google.maps.Geocoder();
            }

            function geo(address, callback) {
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var location = results[0].geometry.location;
                        callback(location);
                    }
                });
            }

            function handleLocation(location) {
                //do your stuff here
                alert(location)
            }

            initialize();
              geo("new york", handleLocation);
        </script>
    </head>
    <body>
