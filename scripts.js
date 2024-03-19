//Creating a modular accordion in case we need multiple accordions on the Page

class Accordion {
    //default constructor
    constructor(el){
        //store <details>
        this.el = el;
        //store <summary>
        this.summary = el.querySelector('summary');
        // store expanded content
        this.content = el.querySelector('.question-content');
        //store expand icon
        this.icon = this.summary.querySelector('.expand-icon');

        //store animation object (to cancel it)
        this.animation = null;
        //is closing state
        this.isClosing = false;
        //opening state
        this.isExpanding = false;
        //Add click listener to the Summary element
        //this within eventHandler is always a reference to element being attached
        this.summary.addEventListener('click', (e) => this.onClick(e));


    }
    //When user clicks on a Summary element, 4 states can be possible
    //the element can be opening, open, closing, or closed, and determines
    //whether to open or close element
    onClick(e){
        //stop default expansion w/o animation
        e.preventDefault();
        //add overflow on details so it doesnt bleed out of the box
        this.el.style.overflow = 'hidden';
        //check if already closing or closed
        if (this.isClosing || !this.el.open) {
            this.open();
        //check if element is opening or already open
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }
    //Hide content with an animaton
    shrink(){
        this.isClosing = true;
        //offsetHeight is border+padding+content, not margin
        const startHeight = `${this.el.offsetHeight}px`;//current height
     
        const endHeight = `${this.summary.offsetHeight + 16}px`;// calc end height
        //check if already running
        if (this.animation) {
            this.animation.cancel();
        }
        //WAAPI animation
        this.animation = this.el.animate (
            {

            //the keyframes are start pos and end pos
            //changes height of <details to fit the summary within it
            height: [startHeight, endHeight]
            }, {
                duration: 400,
                easing: 'ease-out'
            });
        //Call animation finish when animation completes
        this.animation.onfinish = () => this.onAnimationFinish(false);
        //if it's canceled, set isClosing to false so it can close again
        this.animation.oncancel = () => this.isClosing = false;
    }

    //opens the element after click
    open(){
        //Apply fixed height
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        //call on next free animation frame
        window.requestAnimationFrame(() => this.expand());
    }
    //Expands content with animation
    expand(){        
        this.isExpanding = true;
        //get current fixed height
        const startHeight = `${this.el.offsetHeight}px`;
        //calc end height (summary height + content height) ALSO NEED TO GET MARGIN   vvv TERRIBLE FIX 
        const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight + 16}px`;

        //check if already running 
        if (this.animation) {
            this.animation.cancel();
        }
        //start WAAPI animation
        this.animation = this.el.animate ({
            //keyframes are start and end 
            height: [startHeight, endHeight]
        }, {
            duration: 400,
            easing: 'ease-out'

        });

        this.animation.onfinish = () => this.onAnimationFinish(true);
        //reset state if animation cancels
        this.animation.oncancel = () => this.isExpanding = false;
    }
    //Callback when shrink or expand is finished
    //State of whether accordion is open or not is passed here
    onAnimationFinish(open){

    //reset states
    this.el.open = open;
    this.animation = null; //clear stored animation
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';

    //change icon if open or not
        if (open) {
            this.icon.src="./assets/images/icon-minus.svg";
        } else if (!open) {
            this.icon.src="./assets/images/icon-plus.svg";
        }
    }
}
//create event listener for each Details accordion
document.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
});