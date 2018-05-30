
    var sessionTimer = {        

        remainingTimer: 0,
        runningTimer: false,
        isTimeout: false,       
        idleIntervalID: 0,
        lastTimeChecked: $.now(),
        timerInterval: 300000,//Every 5 min
        warnLimit: 6,//warn if less than six minutes
        //cache DOM to not read for every command
        $btnSessionExpiredCancelled:  $('#btnSessionExpiredCancelled'),
        $btnOk : $('#btnOk'),
        $btnLogoutNow : $('#btnLogoutNow'),
        $sessionExpiredModal :  $('#session-expired-modal'),
        $sessionExpireWarning : $('#session-expire-warning-modal'),
        $sessionValue : $('#sessionValue'),
        $secondsTimer: $('#seconds-timer'),
        $btnSessionExpiredOK: $('#btnExpiredOk'),
        
        
        Init: (function (timeoutInterval, warnLimit) {
            this.timerInterval = timeoutInterval;
            this.warnLimit = warnLimit;
            this.startIdleTime();            
            this.bindEvents();
        }),

        bindEvents: function(){
            this.$btnSessionExpiredCancelled.on('click', this.sessionExpiredCancelled.bind(this));//ignore btn
            this.$btnOk.on('click', this.extendSesseion.bind(this));//Extend session btn
            this.$btnSessionExpiredOK.on('click', this.loginNow.bind(this)); //Expired msg ok btn
            this.$btnLogoutNow.on('click', this.logoutNow.bind(this));//logout now btn
           
        },


        startIdleTime: function () {
            this.stopIdleTimeout();
            this.runningTimer = false;
            this.idleIntervalID = setInterval(this.sessCheckTime.bind(this), this.timerInterval);
            console.log("start session monitor");
        },

        stopIdleTimeout: function () { 
            clearInterval(this.idleIntervalID);
        },

        checkTimeout: function (timeLeft) {
            console.log("Check Timeout: " + timeLeft);
            switch (true) {
                case timeLeft=='expired':
                    this.$sessionExpireWarning.modal('hide');
                    this.$sessionExpiredModal.modal('show');
                    break;
                case $.isNumeric(timeLeft):
                    this.remainingTimer = timeLeft;
                    this.lastTimeChecked = $.now();
                    if (timeLeft < this.warnLimit && !this.runningTimer) {
                        this.countdownDisplay();
                        this.$secondsTimer.empty();
                        this.$sessionExpireWarning.modal('show');
                        this.runningTimer = true;

                    } else if (timeLeft <= 0) {                        
                        this.$sessionExpireWarning.modal('hide');
                        this.$sessionExpiredModal.modal('show');
                        this.runningTimer = false;
                    }
                    break;
                default:
                    console.log("Error in timeout check:" + timeLeft);
                    break;
            }
            
        },

        countdownDisplay: function () {
            console.log("start countdown");
            var dialogDisplaySeconds = Math.floor(this.quickTimeRemaining() * 60);            
            var me = this;
            remainingTimer = setInterval(function () {
                console.log("remaining timer: " + dialogDisplaySeconds);
                if (dialogDisplaySeconds <= 0) {
                    console.log("remaining timer: times Up! ");
                    me.runningTimer = false;
                    clearInterval(remainingTimer);
                    me.sessCheckTime();
                }
                else if (!me.runningTimer) {
                    console.log("remaining timer: warning ignored ");                    
                    clearInterval(remainingTimer);
                } 
                else {                    
                    var displayMinSeconds = Math.floor(dialogDisplaySeconds / 60).toString() + " minutes " + (dialogDisplaySeconds % 60).toString();
                    me.$secondsTimer.html(displayMinSeconds);
                    dialogDisplaySeconds -= 1;
                }
            }, 1000);
        },

        quickTimeRemaining: function () {
            console.log("Quick Time: " + $.now() + " : " + this.lastTimeChecked);
            var minutesSinceLastCheck = (($.now() - this.lastTimeChecked) / 1000) / 60;
            console.log("Quick Time result: " + minutesSinceLastCheck + " : " + this.remainingTimer);
            var quickTime = (this.remainingTimer - minutesSinceLastCheck);

            return quickTime;           
        },
        showWarning: function () {
            console.log("show warning: ");
            this.$sessionExpireWarning.modal('show');
            this.$sessionExpireWarning.before($('.modal-backdrop'));
            this.$sessionExpireWarning.css('z-index', parseInt($('.modal-backdrop').css('z-index')) + 1);
        },

        showExpired: function () {
            console.log("show expired: ");
            this.$sessionExpireWarning.modal('hide');
            this.$sessionExpiredModal.before($('.modal-backdrop'));
            this.$sessionExpiredModal.css('z-index', parseInt($('.modal-backdrop').css('z-index')) + 1);
        },

        sessionExpiredCancelled: function(){
            $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
            this.runningTimer = false;
        },

        extendSesseion: function () {
            this.$sessionExpireWarning.modal('hide');
            $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
            this.startIdleTime();
            clearInterval(remainingTimer);
            api.renewSessionTime();
        },
        loginNow: function () {
            this.$sessionExpiredModal.modal('hide');
            //$.ajax call
            this.destroy();
        },
        logoutNow: function() {            
            this.$sessionExpiredModal.modal('hide');
            this.sessLogOutCall();
            this.destroy();
        },
        sessLogOutCall: function () {
            alert("logout!");
            //$.ajax post 
        },
        sessCheckTime: function () {
            if (!this.runningTimer) {
                // $.ajax post with token to check time.
            }
        },
        destroy: function () {
            this.$btnSessionExpiredCancelled.off('click', this.sessionExpiredCancelled);
            this.$btnOk.off('click', this.extendSesseion);
            this.$btnLogoutNow.off('click', this.logoutNow);
            this.$btnSessionExpiredOK.off('click', this.loginNow);
        }
    };

   // return sessionTimer;
    

