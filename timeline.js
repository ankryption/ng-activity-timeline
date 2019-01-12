angular.module("MyApp", []).directive('timeline', function() {
    return {
        restrict: 'E',
        templateUrl: '/ng-timeline/timeline.html',
        scope: {
            data: "=",
            isTicket: '=?',
            showOptions: "="
        },
        controller: function($scope, $element, $timeout) {
            insertLineElement();

            function createUUID() {
                // http://www.ietf.org/rfc/rfc4122.txt
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                var uuid = s.join("");
                return uuid;
            }

            function scrolled(o) {
                if (o.offsetHeight + o.scrollTop == o.scrollHeight) {
                    alert("End");
                }
            }

            function insertLineElement() {
                // We use '$timeout' to run our code after DOM content is completely loaded
                $timeout(function() {
                    // 1. Get our style-sheet (with custom KN CSS) from all loaded stylesheets.
                    // 2. Get computedHeight of the full timeline section.
                    // 3. Give this 'computedHeight' to ::after pseudo-property to first cards icon.
                    // 4. Repeat this on fetching new records (infinite-scroll)
                    var mainStyleSheet = null;
                    var styleSheets = document.styleSheets;
                    var timelineCards = document.getElementsByClassName('t-item');
                    var timelinePage = document.getElementsByClassName('timeline')[0];
                    angular.forEach(styleSheets, function(styleSheet) {
                        if (styleSheet && styleSheet.href && styleSheet.href.indexOf('timeline') > -1) {
                            mainStyleSheet = styleSheet;
                        }
                    });
                    if (timelineCards && timelineCards[0] && timelineCards[0].children && timelineCards[0].children[0]) {
                        var uuid = createUUID();
                        var pageHeight = parseInt(timelinePage.clientHeight);
                        // We subtract from a white-space from 'timelinePage.clientHeight' to account for (padding-top + padding-bottom + card[0].clientHeight/2)
                        var whiteSpace = (48 * 2) + (timelineCards[0].children[1].clientHeight / 2);
                        timelineCards[0].children[0].id = "icon-" + uuid;
                        mainStyleSheet.insertRule('.timeline .t-list .t-item #icon-' + uuid + '::after {padding-bottom: ' + (pageHeight - whiteSpace) + 'px}', 1);
                    }
                });
            }
            // $scope.$on('scroll.infiniteScrollComplete', function() {
            //     insertLineElement();
            // });
        }
    };
})